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
import { ROLES } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { FORBIDDEN, NO_CONTENT } from '../../http-status-codes';
import { getDisclosureIdsForReviewer } from '../db/additional-reviewer-db';
import { createAndSendResubmitNotification } from '../services/notification-service/notification-service';
import wrapAsync from './wrap-async';
import Log from '../log';

export const init = app => {
  app.get('/api/coi/pi', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    const result = await PIDB.getSuggestions(req.dbInfo, req.query.term);
    res.send(result);
  }));

  /**
    User can only respond to review items which are associated with their disclosures
  */
  app.post('/api/coi/pi-response/:reviewId', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      const result = await PIReviewDB.recordPIResponse(req.dbInfo, req.userInfo, req.params.reviewId, req.body.comment);
      res.send(result);
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only revise questions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      const result = await PIReviewDB.reviseQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.body.answer);
      res.send(result);
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only revise questions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/entity-question/:questionId', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      const result = await PIReviewDB.reviseEntityQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.params.questionId, req.body.answer);
      res.send(result);
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only add relationships for entities which are associated with their disclosures
  */
  app.post('/api/coi/pi-revise/:reviewId/entity-relationship', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      const result = await PIReviewDB.addRelationship(req.dbInfo, req.userInfo, req.params.reviewId, req.body);
      res.send(result);
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only remove relationships for entities which are associated with their disclosures
  */
  app.delete('/api/coi/pi-revise/:reviewId/entity-relationship/:relationshipId', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      await PIReviewDB.removeRelationship(req.dbInfo, req.userInfo, req.params.reviewId, req.params.relationshipId);
      res.status(NO_CONTENT).end();
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only revise declarations which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/declaration', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      await PIReviewDB.reviseDeclaration(req.dbInfo, req.userInfo, req.params.reviewId, req.body);
      res.status(NO_CONTENT).end();
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only revise subquestions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/subquestion-answer/:subQuestionId', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      await PIReviewDB.reviseSubQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.params.subQuestionId, req.body);
      res.status(NO_CONTENT).end();
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only remove answers for questions which are associated with their disclosures
  */
  app.delete('/api/coi/pi-revise/:reviewId/question-answers', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const isAllowed = await PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId);
    if (isAllowed) {
      await PIReviewDB.deleteAnswers(req.dbInfo, req.userInfo, req.params.reviewId, req.body.toDelete);
      res.status(NO_CONTENT).end();
      return;
    }

    res.status(FORBIDDEN).end();
  }));

  /**
    User can only resubmit their own disclosures
  */
  app.put('/api/coi/pi-revise/:disclosureId/submit', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    await PIReviewDB.reSubmitDisclosure(req.dbInfo, req.userInfo, req.params.disclosureId);
    try {
      createAndSendResubmitNotification(req.dbInfo, req.hostname, req.headers.authorization, req.userInfo, req.params.disclosureId);
    } catch (err) {
      Log.error(err, req);
    }
    const result = {success: true};
    res.send(result);
  }));

  /**
   Reviewer can only see ones where they are a reviewer
   */
  app.get('/api/coi/disclosures/:id/pi-responses', allowedRoles([ADMIN, REVIEWER]), wrapAsync(async (req, res) => {
    if (req.userInfo.coiRole === ROLES.REVIEWER) {
      const reviewerDisclosureIds = await getDisclosureIdsForReviewer(req.dbInfo, req.userInfo.schoolId);
      if (!reviewerDisclosureIds.includes(req.params.id)) {
        res.sendStatus(FORBIDDEN);
        return;
      }
    }

    const result = await PIReviewDB.getPIResponseInfo(req.dbInfo, req.params.id);
    res.send(result);
  }));
};
