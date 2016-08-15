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

import * as PIDB from '../db/pi-db';
import * as PIReviewDB from '../db/pi-review-db';
import {isDisclosureUsers} from '../db/common-db';
import { ROLES } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { FORBIDDEN, NO_CONTENT } from '../../http-status-codes';
import { getDisclosureIdsForReviewer } from '../db/additional-reviewer-db';
import {
  createAndSendResubmitNotification
} from '../services/notification-service/notification-service';
import wrapAsync from './wrap-async';
import Log from '../log';
import useKnex from '../middleware/request-knex';

async function verifyReviewIsForUser({dbInfo, params, userInfo}, res, next) {
  const isAllowed = await PIReviewDB.verifyReviewIsForUser(
    dbInfo,
    params.reviewId,
    userInfo.schoolId
  );
  if (!isAllowed) {
    res.status(FORBIDDEN).end();
    return;
  }
  next();
}

export const init = app => {
  app.get(
    '/api/coi/pi',
    allowedRoles([ADMIN, REVIEWER]),
    wrapAsync(async ({dbInfo, query, userInfo}, res) => {
      const result = await PIDB.getSuggestions(
        dbInfo,
        query.term,
        userInfo
      );
      res.send(result);
    }
  ));

  /**
    User can only respond to review items which are associated with their
    disclosures
  */
  app.post(
    '/api/coi/pi-response/:reviewId',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo, body}, res) =>
    {
      const result = await PIReviewDB.recordPIResponse(
        dbInfo,
        userInfo,
        params.reviewId,
        body.comment
      );
      res.send(result);
    }
  ));

  /**
    User can only revise questions which are associated with their disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo, body}, res) => {
      const result = await PIReviewDB.reviseQuestion(
        dbInfo,
        userInfo,
        params.reviewId,
        body.answer
      );
      res.send(result);
    }
  ));

  /**
    User can only revise questions which are associated with their disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId/entity-question/:questionId',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo, body}, res) => {
      const result = await PIReviewDB.reviseEntityQuestion(
        dbInfo,
        userInfo,
        params.reviewId,
        params.questionId,
        body.answer
      );
      res.send(result);
    }
  ));

  /**
    User can only add relationships for entities which are associated with their
    disclosures
  */
  app.post(
    '/api/coi/pi-revise/:reviewId/entity-relationship',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo, body}, res) => {
      const result = await PIReviewDB.addRelationship(
        dbInfo,
        userInfo,
        params.reviewId,
        body
      );
      res.send(result);
    }
  ));

  /**
    User can only remove relationships for entities which are associated with
    their disclosures
  */
  app.delete(
    '/api/coi/pi-revise/:reviewId/entity-relationship/:relationshipId',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo}, res) => {
      await PIReviewDB.removeRelationship(
        dbInfo,
        userInfo,
        params.reviewId,
        params.relationshipId
      );
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    User can only revise declarations which are associated with their
    disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId/declaration',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo, body}, res) => {
      await PIReviewDB.reviseDeclaration(
        dbInfo,
        userInfo,
        params.reviewId,
        body
      );
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    User can only revise subquestions which are associated with their
    disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId/subquestion-answer/:subQuestionId',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo, body}, res) => {
      await PIReviewDB.reviseSubQuestion(
        dbInfo,
        userInfo,
        params.reviewId,
        params.subQuestionId,
        body
      );
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    User can only remove answers for questions which are associated with their
    disclosures
  */
  app.delete(
    '/api/coi/pi-revise/:reviewId/question-answers',
    allowedRoles('ANY'),
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({dbInfo, params, userInfo, body}, res) => {
      await PIReviewDB.deleteAnswers(
        dbInfo,
        userInfo,
        params.reviewId,
        body.toDelete
      );
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    User can only resubmit their own disclosures
  */
  app.put(
    '/api/coi/pi-revise/:disclosureId/submit',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async (req, res) => {
      const {dbInfo, params, userInfo, hostname, headers, body} = req;

      const isSubmitter = isDisclosureUsers(
        req.knex,
        params.disclosureId,
        userInfo.schoolId
      );

      if (!isSubmitter) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      if (body && Array.isArray(body.responses)) {
        for (const response of body.responses) {
          await PIReviewDB.recordPIResponse(
            dbInfo,
            userInfo,
            response.reviewId,
            response.comment
          );
        }
      }

      await PIReviewDB.reSubmitDisclosure(
        dbInfo,
        userInfo,
        params.disclosureId
      );
      try {
        createAndSendResubmitNotification(
          dbInfo,
          hostname,
          headers.authorization,
          userInfo,
          params.disclosureId
        );
      } catch (err) {
        Log.error(err, req);
      }
      const result = {success: true};
      res.send(result);
    }
  ));

  /**
   Reviewer can only see ones where they are a reviewer
   */
  app.get(
    '/api/coi/disclosures/:id/pi-responses',
    allowedRoles([ADMIN, REVIEWER]),
    useKnex,
    wrapAsync(async ({dbInfo, params, userInfo, knex}, res) => {
      if (userInfo.coiRole === ROLES.REVIEWER) {
        const reviewerDisclosureIds = await getDisclosureIdsForReviewer(
          knex,
          userInfo.schoolId
        );
        if (!reviewerDisclosureIds.includes(params.id)) {
          res.sendStatus(FORBIDDEN);
          return;
        }
      }

      const result = await PIReviewDB.getPIResponseInfo(
        dbInfo,
        params.id
      );
      res.send(result);
    }
  ));
};
