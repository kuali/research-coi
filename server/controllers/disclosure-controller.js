/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import {
  getLatestArchivedDisclosure,
  getArchivedDisclosures,
  getSummariesForUser,
  getAnnualDisclosure,
  get,
  getSummariesForReview,
  getSummariesForReviewCount,
  saveExistingFinancialEntity,
  saveNewFinancialEntity,
  saveDeclaration,
  saveExistingDeclaration,
  saveNewQuestionAnswer,
  saveExistingQuestionAnswer,
  submit,
  approve,
  reject,
  addComment,
  updateComment,
  deleteAnswers,
  getCurrentState,
  saveCurrentState,
  getArchivedDisclosure
} from '../db/disclosure-db';
import * as PIReviewDB from '../db/pi-review-db';
import {isDisclosureUsers} from '../db/common-db';
import wrapAsync from './wrap-async';
import { getDisclosureIdsForReviewer } from '../db/additional-reviewer-db';
import multer from 'multer';
import Log from '../log';
import { ROLES, ADMIN_PAGE_SIZE,LANES } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import {
  FORBIDDEN,
  ACCEPTED,
  BAD_REQUEST,
  NO_CONTENT
} from '../../http-status-codes';
import {
  createAndSendSubmitNotification,
  createAndSendApproveNotification,
  createAndSendSentBackNotification
} from '../services/notification-service/notification-service';
import useKnex from '../middleware/request-knex';

let upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
try {
  const extensions = require('research-extensions').default;
  
  if (extensions.config.lane !== LANES.TEST) {
    upload = extensions.storage;
  }
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    Log.error(err);
  }
}

function validateComment(comment) {
  return (
    comment.topicSection &&
    comment.topicId &&
    comment.text &&
    comment.piVisible !== undefined &&
    comment.reviewerVisible !== undefined &&
    !isNaN(comment.disclosureId)
  );
}

export const init = app => {
  /**
    user can only see their own
  */
  app.get(
    '/api/coi/archived-disclosures/:id/latest',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params}, res) =>
    {
      const result = await getLatestArchivedDisclosure(
        knex,
        userInfo.schoolid,
        params.id
      );
      const disclosure = JSON.parse(result.disclosure);
      if (
        disclosure.userId !== userInfo.schoolId &&
        userInfo.coiRole !== ADMIN
      ) {
        res.sendStatus(FORBIDDEN);
        return;
      }
      res.send(disclosure);
    }
  ));

  /**
    User can only see disclosures which they submitted
  */
  app.get(
    '/api/coi/archived-disclosures',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo}, res) =>
    {
      const result = await getArchivedDisclosures(knex, userInfo.schoolId);
      res.send(result);
    }
  ));

  /**
    User can only see disclosures which they submitted
  */
  app.get(
    '/api/coi/disclosure-user-summaries',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo}, res) =>
    {
      const result = await getSummariesForUser(knex, userInfo.schoolId);
      res.send(result);
    }
  ));

  /**
    User can only see their own annual disclosure
  */
  app.get(
    '/api/coi/disclosures/annual',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, dbInfo, userInfo, headers}, res) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await getAnnualDisclosure(
          dbInfo,
          knexTrx,
          userInfo,
          userInfo.name,
          headers.authorization
        );
      });
      res.send(result);
    }
  ));

  /**
    Admin can see any, User can only see their own,
    Reviewer can only see ones where they are a reviewer or their own
  */
  app.get(
    '/api/coi/disclosures/:id',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({dbInfo, userInfo, params, headers, knex}, res) =>
    {
      if (userInfo.coiRole === REVIEWER) {
        const reviewerDisclosures = await getDisclosureIdsForReviewer(
          knex,
          userInfo.schoolId
        );
        if (!reviewerDisclosures.includes(params.id)) {
          const isSubmitter = await isDisclosureUsers(
            knex,
            params.id,
            userInfo.schoolId
          );

          if (!isSubmitter) {
            res.sendStatus(FORBIDDEN);
            return;
          }
        }
      }

      const result = await get(
        dbInfo,
        knex,
        userInfo,
        params.id,
        headers.authorization
      );
      res.send(result);
    }
  ));

  /**
    Admin can see any, Reviewer can only see ones where they are a reviewer
  */
  app.get(
    '/api/coi/disclosure-summaries',
    allowedRoles([ADMIN, REVIEWER]),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {userInfo, query, knex} = req;

      let reviewerDisclosureIds;
      if (userInfo.coiRole === REVIEWER) {
        reviewerDisclosureIds = await getDisclosureIdsForReviewer(
          knex,
          userInfo.schoolId
        );
      }

      const {
        sortColumn = 'DATE_SUBMITTED',
        sortDirection = 'ASCENDING'
      } = query;

      let filters = {};
      if (query.filters) {
        try {
          let potentialFilter = decodeURIComponent(query.filters);
          potentialFilter = JSON.parse(potentialFilter);
          filters = potentialFilter;
        }
        catch (parseErr) {
          Log.error('invalid filters supplied to disclosure-summaries', req);
          Log.error(parseErr, req);
          throw Error('invalid filters supplied to disclosure-summaries');
        }
      }

      let start = 0;
      if (query.start && !isNaN(query.start)) {
        start = query.start;
      }
      const result = await getSummariesForReview(
        knex,
        sortColumn,
        sortDirection,
        start,
        filters,
        reviewerDisclosureIds,
        ADMIN_PAGE_SIZE
      );
      res.send(result);
    }
  ));

  app.get(
    '/api/coi/disclosure-summaries/count',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {query, knex} = req;
      let filters = {};
      if (query.filters) {
        try {
          let potentialFilter = decodeURIComponent(query.filters);
          potentialFilter = JSON.parse(potentialFilter);
          filters = potentialFilter;
        }
        catch (parseErr) {
          Log.error(
            'invalid filters supplied to disclosure-summaries/count',
            req
          );
          Log.error(parseErr, req);
          throw Error('invalid filters supplied to disclosure-summaries/count');
        }
      }

      const result = await getSummariesForReviewCount(knex, filters);
      res.send(result);
    }
  ));

  /**
    User can only edit entities which are associated with their disclosure
  */
  app.put(
    '/api/coi/disclosures/:id/financial-entities/:entityId',
    allowedRoles('ANY'),
    upload.array('attachments'),
    useKnex,
    wrapAsync(async ({knex, dbInfo, userInfo, params, body, files}, res) => {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await saveExistingFinancialEntity(
          dbInfo,
          knexTrx,
          userInfo,
          params.entityId,
          JSON.parse(body.entity),
          files
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only add entities to disclosures which are theirs
  */
  app.post(
    '/api/coi/disclosures/:id/financial-entities',
    allowedRoles('ANY'),
    upload.array('attachments'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body, files}, res) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await saveNewFinancialEntity(
          knexTrx,
          userInfo,
          params.id,
          JSON.parse(body.entity),
          files
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only add declarations to disclosures which are theirs
  */
  app.post(
    '/api/coi/disclosures/:id/declarations',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({body, params, knex, userInfo}, res) =>
    {
      body.disclosure_id = params.id; //eslint-disable-line camelcase
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await saveDeclaration(
          knexTrx,
          userInfo.schoolId,
          params.id,
          body
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only edit declarations on disclosures which are theirs
  */
  app.put(
    '/api/coi/disclosures/:id/declarations/:declarationId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body}, res) =>
    {
      await knex.transaction(async (knexTrx) => {
        await saveExistingDeclaration(
          knexTrx,
          userInfo,
          params.id,
          params.declarationId,
          body
        );
      });
      res.sendStatus(ACCEPTED);
    }
  ));

  /**
    User can only answer questions on disclosures which are theirs
  */
  app.post(
    '/api/coi/disclosures/:id/question-answers',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body}, res) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await saveNewQuestionAnswer(
          knexTrx,
          userInfo.schoolId,
          params.id,
          body
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only answer questions on disclosures which are theirs
  */
  app.put(
    '/api/coi/disclosures/:id/question-answers/:questionId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body}, res) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await saveExistingQuestionAnswer(
          knexTrx,
          userInfo.schoolId,
          params.id,
          params.questionId,
          body
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only submit disclosures which are theirs
  */
  app.put(
    '/api/coi/disclosures/:id/submit',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {knex, dbInfo, userInfo, params, headers, hostname} = req;
      await knex.transaction(async (knexTrx) => {
        await submit(
          dbInfo,
          knexTrx,
          userInfo,
          params.id,
          headers.authorization,
          hostname
        );
      });

      await createAndSendSubmitNotification(
        dbInfo,
        hostname,
        headers.authorization,
        userInfo,
        params.id
      );

      res.sendStatus(ACCEPTED);
    }
  ));

  app.put(
    '/api/coi/disclosures/:id/approve',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {knex, dbInfo, body, userInfo, params, headers, hostname} = req;
      let archiveId;
      await knex.transaction(async (knexTrx) => {
        archiveId = await approve(
          dbInfo,
          knexTrx,
          body,
          userInfo.name,
          params.id,
          headers.authorization
        );
      });

      await createAndSendApproveNotification(
        dbInfo,
        knex,
        hostname,
        userInfo,
        archiveId
      );

      res.sendStatus(ACCEPTED);
    }
  ));

  app.put(
    '/api/coi/disclosures/:id/reject',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {knex, userInfo, params, dbInfo, hostname} = req;
      await knex.transaction(async (knexTrx) => {
        await reject(knexTrx, userInfo, params.id);
      });

      await createAndSendSentBackNotification(
        dbInfo,
        hostname,
        userInfo,
        params.id
      );

      res.sendStatus(ACCEPTED);
    }
  ));

  /**
    Admin can add any, Reviewer can only add ones where they are a reviewer
  */
  app.post(
    '/api/coi/disclosures/:id/comments',
    allowedRoles([ADMIN, REVIEWER]),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body: comment}, res, next) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        if (userInfo.coiRole === REVIEWER) {
          const reviewerDisclosures = await getDisclosureIdsForReviewer(
            knexTrx,
            userInfo.schoolId
          );
          if (!reviewerDisclosures.includes(params.id)) {
            res.sendStatus(FORBIDDEN);
            return;
          }
        }

        comment.disclosureId = params.id;

        if (!validateComment(comment)) {
          next(new Error('invalid comment body'));
          return;
        }

        result = await addComment(knexTrx, userInfo, comment);
      });
      res.send(result[0]);
    }
  ));

  /**
    Admin can add any, Reviewer can only add ones where they are a reviewer
  */
  app.put(
    '/api/coi/disclosures/:disclosureId/comments/:id',
    allowedRoles([ADMIN, REVIEWER]),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body: comment}, res, next) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        if (userInfo.coiRole === REVIEWER) {
          const reviewerDisclosures = await getDisclosureIdsForReviewer(
            knexTrx,
            userInfo.schoolId
          );
          if (!reviewerDisclosures.includes(params.disclosureId)) {
            res.sendStatus(FORBIDDEN);
            return;
          }
        }

        if (!validateComment(comment)) {
          next(new Error('invalid comment body'));
          return;
        }

        result = await updateComment(knexTrx, userInfo, comment);
      });
      res.send(result);
    }
  ));

  /**
    User can only retrieve items if this disclosure is theirs
  */
  app.get(
    '/api/coi/disclosures/:id/pi-review-items',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params}, res) =>
    {
      const result = await PIReviewDB.getPIReviewItems(
        knex,
        userInfo,
        params.id
      );
      res.send(result);
    }
  ));

  /**
    Can only delete answers if this disclosure is theirs
  */
  app.delete(
    '/api/coi/disclosures/:id/question-answers',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({body, knex, userInfo, params}, res) =>
    {
      const {toDelete: proposedDeletions = []} = body;

      const toDelete = [];
      if (Array.isArray(proposedDeletions)) {
        proposedDeletions.forEach(proposedDeletion => {
          if (Number.isInteger(proposedDeletion)) {
            toDelete.push(proposedDeletion);
          }
        });
      }

      await knex.transaction(async (knexTrx) => {
        if (toDelete.length === 0) {
          res.status(BAD_REQUEST).end();
          return;
        }

        await deleteAnswers(
          knexTrx,
          userInfo,
          params.id,
          toDelete
        );
      });

      res.status(NO_CONTENT).end();
    }
  ));

  /**
    Can only retrieve state of their disclosure
  */
  app.get(
    '/api/coi/disclosures/:id/state',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params}, res) =>
    {
      const result = await getCurrentState(knex, userInfo, params.id);
      res.send(result);
    }
  ));

  /**
    Can only save the state of their disclosure
  */
  app.post(
    '/api/coi/disclosures/:id/state',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body}, res) =>
    {
      res.status(ACCEPTED).end();
      await saveCurrentState(knex, userInfo, params.id, body);
    }
  ));

  app.get(
    '/api/coi/archived-disclosures/:archiveId',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({knex, params}, res) =>
    {
      const result = await getArchivedDisclosure(knex, params.archiveId);
      const archive = JSON.parse(result.disclosure);
      res.send(archive);
    }
  ));
};
