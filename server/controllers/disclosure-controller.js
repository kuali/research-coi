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

import DisclosureDB from '../db/disclosure-db';
import PIReviewDB from '../db/pi-review-db';
import FileDB from '../db/file-db';
import CommonDB from '../db/common-db';
import wrapAsync from './wrap-async';
import ReviewerDB from '../db/additional-reviewer-db';
import multer from 'multer';
import {
  ROLES,
  ADMIN_PAGE_SIZE,
  LANES,
  DISCLOSURE_STEP
} from '../../coi-constants';
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
  createAndSendSentBackNotification,
  returnToReporterNotification
} from '../services/notification-service/notification-service';
import useKnex from '../middleware/request-knex';
import {createLogger} from '../log';
const log = createLogger('DisclosureController');

let upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
try {
  const extensions = require('research-extensions').default;
  
  if (extensions.config.lane !== LANES.TEST) {
    upload = extensions.storage;
  }
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    log.error(err);
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
      const result = await DisclosureDB.getLatestArchivedDisclosure(
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
      const result = await DisclosureDB.getArchivedDisclosures(
        knex,
        userInfo.schoolId
      );
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
      const result = await DisclosureDB.getSummariesForUser(
        knex,
        userInfo.schoolId
      );
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
        result = await DisclosureDB.getAnnualDisclosure(
          dbInfo,
          knexTrx,
          userInfo,
          userInfo.displayName,
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
        const reviewerDisclosures = await ReviewerDB.getDisclosureIdsForReviewer( // eslint-disable-line max-len
          knex,
          userInfo.schoolId
        );
        if (!reviewerDisclosures.includes(params.id)) {
          const isSubmitter = await CommonDB.isDisclosureUsers(
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

      const result = await DisclosureDB.get(
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
        reviewerDisclosureIds = await ReviewerDB.getDisclosureIdsForReviewer(
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
          log.error('invalid filters supplied to disclosure-summaries', req);
          log.error(parseErr, req);
          throw Error('invalid filters supplied to disclosure-summaries');
        }
      }

      let start = 0;
      if (query.start && !isNaN(query.start)) {
        start = query.start;
      }
      const result = await DisclosureDB.getSummariesForReview(
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
          log.error(
            'invalid filters supplied to disclosure-summaries/count',
            req
          );
          log.error(parseErr, req);
          throw Error('invalid filters supplied to disclosure-summaries/count');
        }
      }

      const result = await DisclosureDB.getSummariesForReviewCount(
        knex,
        filters
      );
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
        result = await DisclosureDB.saveExistingFinancialEntity(
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
    '/api/coi/disclosures/:disclosureId/financial-entities',
    allowedRoles('ANY'),
    upload.array('attachments'),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body, files}, res) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await DisclosureDB.saveNewFinancialEntity(
          knexTrx,
          userInfo,
          params.disclosureId,
          JSON.parse(body.entity),
          files
        );

        if (body.duringRevision === 'true') {
          await PIReviewDB.upsertReviewRecord(
            knexTrx,
            params.disclosureId,
            DISCLOSURE_STEP.ENTITIES,
            result.id,
            {revised: true}
          );

          const declarationIds = await DisclosureDB.createEmptyDeclarations(
            knexTrx,
            params.disclosureId,
            userInfo.schoolId,
            result.id
          );

          for (const declarationId of declarationIds) {
            await PIReviewDB.upsertReviewRecord(
              knexTrx,
              params.disclosureId,
              DISCLOSURE_STEP.PROJECTS,
              declarationId,
              {}
            );
          }
        }
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
        result = await DisclosureDB.saveDeclaration(
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
        await DisclosureDB.saveExistingDeclaration(
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
        result = await DisclosureDB.saveNewQuestionAnswer(
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
        result = await DisclosureDB.saveExistingQuestionAnswer(
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
        await DisclosureDB.submit(
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
        archiveId = await DisclosureDB.approve(
          dbInfo,
          knexTrx,
          body,
          userInfo.displayName,
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
        await DisclosureDB.reject(knexTrx, userInfo, params.id);
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

  app.put(
      '/api/coi/disclosures/:id/return',
      allowedRoles(ADMIN),
      useKnex,
      wrapAsync(async (req, res) =>
      {
        const {
          knex,
          userInfo,
          params,
          dbInfo,
          hostname,
          body: comment
          } = req;
        await knex.transaction(async (knexTrx) => {
          await DisclosureDB.returnToReporter(knexTrx, userInfo, params.id);
        });

        await knex.transaction(async (knexTrx) => {
          await DisclosureDB.deleteAllAnswers(
            knexTrx,
            userInfo,
            params.id
          );

          comment.disclosureId = params.id;
          await DisclosureDB.addGeneralComment(knexTrx, userInfo, comment);
        });

        await returnToReporterNotification(
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
          const reviewerDisclosures = await ReviewerDB.getDisclosureIdsForReviewer( // eslint-disable-line max-len
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

        result = await DisclosureDB.addComment(knexTrx, userInfo, comment);
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
          const reviewerDisclosures = await ReviewerDB.getDisclosureIdsForReviewer( // eslint-disable-line max-len
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

        result = await DisclosureDB.updateComment(knexTrx, userInfo, comment);
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
    wrapAsync(async ({knex, userInfo, params, headers, dbInfo}, res) =>
    {
      const result = await PIReviewDB.getPIReviewItems(
        knex,
        userInfo,
        params.id,
        headers.authorization,
        dbInfo
      );
      const fileType = 'disclosure';
      const files = await FileDB.getFilesForReview(
          knex,
          userInfo,
          params.id,
          fileType
      );
      result.files = files;
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

      if (toDelete.length === 0) {
        res.status(BAD_REQUEST).end();
        return;
      }

      await knex.transaction(async (knexTrx) => {
        await DisclosureDB.deleteAnswers(
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
      const result = await DisclosureDB.getCurrentState(
        knex,
        userInfo,
        params.id
      );
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
      await DisclosureDB.saveCurrentState(knex, userInfo, params.id, body);
    }
  ));

  app.get(
    '/api/coi/archived-disclosures/:archiveId',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({knex, params}, res) =>
    {
      const result = await DisclosureDB.getArchivedDisclosure(
        knex,
        params.archiveId
      );
      const archive = JSON.parse(result.disclosure);
      res.send(archive);
    }
  ));
};
