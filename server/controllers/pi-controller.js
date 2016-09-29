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
import {
  isDisclosureUsers,
  isFinancialEntityUsers,
  isProjectUsers
} from '../db/common-db';
import { ROLES } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { FORBIDDEN, NO_CONTENT } from '../../http-status-codes';
import { getDisclosureIdsForReviewer } from '../db/additional-reviewer-db';
import {
  createAndSendResubmitNotification
} from '../services/notification-service/notification-service';
import wrapAsync from './wrap-async';
import useKnex from '../middleware/request-knex';

async function verifyReviewIsForUser({knex, params, userInfo}, res, next) {
  const isAllowed = await PIReviewDB.verifyReviewIsForUser(
    knex,
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
    useKnex,
    wrapAsync(async ({query, userInfo, knex}, res) => {
      const result = await PIDB.getSuggestions(
        knex,
        query.term,
        userInfo
      );
      res.send(result);
    })
  );

  /**
    User can only respond to review items which are associated with their
    disclosures
  */
  app.post(
    '/api/coi/pi-response/:reviewId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo, body}, res) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await PIReviewDB.recordPIResponse(
          knexTrx,
          userInfo,
          params.reviewId,
          body.comment
        );
      });
      res.send(result);
    }
  ));

  /**
    -- DEPRECATED:
    Use /api/coi/disclosures/:disclosureId/pi-revise-by-question-id/:questionId

    User can only revise questions which are associated with their disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await PIReviewDB.reviseScreeningQuestion(
          knexTrx,
          userInfo,
          params.reviewId,
          body.answer
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only revise questions which are associated with their disclosures
  */
  app.put(
    '/api/coi/disclosures/:disclosureId/pi-revise-by-question-id/:questionId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      const isSubmitter = await isDisclosureUsers(
        knex,
        params.disclosureId,
        userInfo.schoolId
      );

      if (!isSubmitter) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      let result;
      await knex.transaction(async (knexTrx) => {
        result = await PIReviewDB.reviseScreeningQuestionById(
          knexTrx,
          userInfo,
          params.disclosureId,
          params.questionId,
          body.answer
        );
      });
      res.send(result);
    }
  ));

  /**
    -- DEPRECATED:
    Use /api/coi/entities/:entityId/entity-question/:questionId

    User can only revise questions which are associated with their disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId/entity-question/:questionId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await PIReviewDB.reviseEntityQuestion(
          knexTrx,
          userInfo,
          params.reviewId,
          params.questionId,
          body.answer
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only revise questions which are associated with their entities
  */
  app.put(
    '/api/coi/entities/:entityId/entity-question/:questionId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      const isOwner = await isFinancialEntityUsers(
        knex,
        params.entityId,
        userInfo.schoolId
      );

      if (!isOwner) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      let result;
      await knex.transaction(async (knexTrx) => {
        result = await PIReviewDB.reviseEntityQuestionById(
          knexTrx,
          userInfo,
          params.entityId,
          params.questionId,
          body.answer
        );
      });
      res.send(result);
    }
  ));

  /**
    -- DEPRECATED:
    Use /api/coi/entities/:entityId/relationship

    User can only add relationships for entities which are associated with their
    disclosures
  */
  app.post(
    '/api/coi/pi-revise/:reviewId/entity-relationship',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await PIReviewDB.addRelationship(
          knexTrx,
          userInfo,
          params.reviewId,
          body
        );
      });
      res.send(result);
    }
  ));

  /**
    User can only add relationships for entities which are associated with their
    disclosures
  */
  app.post(
    '/api/coi/entities/:entityId/relationship',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      const isOwner = await isFinancialEntityUsers(
        knex,
        params.entityId,
        userInfo.schoolId
      );

      if (!isOwner) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      let result;
      await knex.transaction(async (knexTrx) => {
        result = await PIReviewDB.addRelationshipById(
          knexTrx,
          userInfo,
          params.entityId,
          body
        );
      });
      res.send(result);
    }
  ));

  /**
    -- DEPRECATED:
    Use /api/coi/entities/:entityId/relationship/:relationshipId

    User can only remove relationships for entities which are associated with
    their disclosures
  */
  app.delete(
    '/api/coi/pi-revise/:reviewId/entity-relationship/:relationshipId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo}, res) => {
      await knex.transaction(async (knexTrx) => {
        await PIReviewDB.removeRelationship(
          knexTrx,
          userInfo,
          params.reviewId,
          params.relationshipId
        );
      });
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    User can only remove relationships for entities which are associated with
    their disclosures
  */
  app.delete(
    '/api/coi/entities/:entityId/relationship/:relationshipId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, params, userInfo}, res) => {
      const isOwner = await isFinancialEntityUsers(
        knex,
        params.entityId,
        userInfo.schoolId
      );

      if (!isOwner) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      await knex.transaction(async (knexTrx) => {
        await PIReviewDB.removeRelationshipById(
          knexTrx,
          userInfo,
          params.entityId,
          params.relationshipId
        );
      });
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    -- DEPRECATED:
    Use /api/coi/entities/:entityId/projects/:projectId

    User can only revise declarations which are associated with their
    disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId/declaration',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      await knex.transaction(async (knexTrx) => {
        await PIReviewDB.reviseDeclaration(
          knexTrx,
          userInfo,
          params.reviewId,
          body
        );
      });
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    User can only revise declarations which are associated with their
    disclosures
  */
  app.put(
    '/api/coi/entities/:entityId/projects/:projectId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      const [isEntityOwner, isProjectOwner] = await Promise.all([
        isFinancialEntityUsers(
          knex,
          params.entityId,
          userInfo.schoolId
        ),
        isProjectUsers(
          knex,
          params.projectId,
          userInfo.schoolId
        )
      ]);

      if (!isEntityOwner || !isProjectOwner) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      await knex.transaction(async (knexTrx) => {
        await PIReviewDB.reviseDeclarationById(
          knexTrx,
          userInfo,
          params.entityId,
          params.projectId,
          body
        );
      });
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    -- DEPRECATED:
    Use /api/coi/disclosures/:disclosureId/subquestion-answer/:subQuestionId

    User can only revise subquestions which are associated with their
    disclosures
  */
  app.put(
    '/api/coi/pi-revise/:reviewId/subquestion-answer/:subQuestionId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      await knex.transaction(async (knexTrx) => {
        await PIReviewDB.reviseSubQuestion(
          knexTrx,
          userInfo,
          params.reviewId,
          params.subQuestionId,
          body
        );
      });
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    User can only revise subquestions which are associated with their
    disclosures
  */
  app.put(
    '/api/coi/disclosures/:disclosureId/subquestion-answer/:subQuestionId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      const isSubmitter = await isDisclosureUsers(
        knex,
        params.disclosureId,
        userInfo.schoolId
      );

      if (!isSubmitter) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      await knex.transaction(async (knexTrx) => {
        await PIReviewDB.reviseSubQuestionByQuestionId(
          knexTrx,
          userInfo,
          params.disclosureId,
          params.subQuestionId,
          body
        );
      });
      res.status(NO_CONTENT).end();
    }
  ));

  /**
    -- DEPRECATED:
    Use /api/coi/disclosures/:id/question-answers

    User can only remove answers for questions which are associated with their
    disclosures
  */
  app.delete(
    '/api/coi/pi-revise/:reviewId/question-answers',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(verifyReviewIsForUser),
    wrapAsync(async ({knex, params, userInfo, body}, res) => {
      await knex.transaction(async (knexTrx) => {
        await PIReviewDB.deleteAnswers(
          knexTrx,
          userInfo,
          params.reviewId,
          body.toDelete
        );
      });
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
      const {dbInfo, params, userInfo, hostname, headers, body, knex} = req;

      const isSubmitter = isDisclosureUsers(
        knex,
        params.disclosureId,
        userInfo.schoolId
      );

      if (!isSubmitter) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      await knex.transaction(async (knexTrx) => {
        if (body && Array.isArray(body.responses)) {
          for (const response of body.responses) {
            await PIReviewDB.recordPIResponse(
              knexTrx,
              userInfo,
              response.reviewId,
              response.comment
            );
          }
        }

        await PIReviewDB.reSubmitDisclosure(
          knexTrx,
          userInfo,
          params.disclosureId
        );
      });

      createAndSendResubmitNotification(
        dbInfo,
        hostname,
        headers.authorization,
        userInfo,
        params.disclosureId
      );

      res.send({success: true});
    }
  ));

  /**
   Reviewer can only see ones where they are a reviewer
   */
  app.get(
    '/api/coi/disclosures/:id/pi-responses',
    allowedRoles([ADMIN, REVIEWER]),
    useKnex,
    wrapAsync(async ({knex, params, userInfo}, res) => {
      if (userInfo.coiRole === REVIEWER) {
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
        knex,
        params.id
      );
      res.send(result);
    }
  ));
};
