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

import * as AdditionalReviewerDB from '../db/additional-reviewer-db';
import { getReviewers } from '../services/auth-service/auth-service';
import { ROLES, DATE_TYPE } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { OK, ACCEPTED } from '../../http-status-codes';
import Log from '../log';
import wrapAsync from './wrap-async';
import {
  createAndSendReviewerAssignedNotification,
  createAndSendReviewCompleteNotification,
  createAndSendReviewerUnassignNotification
} from '../services/notification-service/notification-service';
import useKnex from '../middleware/request-knex';

export const init = app => {
  app.post('/api/coi/additional-reviewers', allowedRoles(ADMIN), useKnex, wrapAsync(async (req, res) => {
    let result;
    await req.knex.transaction(async (knex) => {
      result = await AdditionalReviewerDB.createAdditionalReviewer(
        knex,
        req.body,
        req.userInfo
      );
      try {
        createAndSendReviewerAssignedNotification(
          req.dbInfo,
          req.hostname,
          req.userInfo,
          result.id
        );
      } catch (err) {
        Log.error(err,req);
      }
    });
    res.send(result);
  }));

  app.delete('/api/coi/additional-reviewers/:id', allowedRoles(ADMIN), useKnex, wrapAsync(async (req, res) => {
    await req.knex.transaction(async (knex) => {
      try {
        createAndSendReviewerUnassignNotification(req.dbInfo, req.hostname, req.userInfo, req.params.id);
      } catch (err) {
        Log.error(err,req);
      }
      await AdditionalReviewerDB.deleteAdditionalReviewer(knex, req.params.id);
    });
    res.sendStatus(OK);
  }));

  app.put('/api/coi/additional-reviewers/:id', allowedRoles(ADMIN), useKnex, wrapAsync(async (req, res) => {
    await req.knex.transaction(async (knex) => {
      await AdditionalReviewerDB.updateAdditionalReviewer(
        knex,
        req.params.id,
        req.body
      );
    });
    res.sendStatus(OK);
  }));

  app.put('/api/coi/additional-reviewers/complete-review/:disclosureId', allowedRoles(REVIEWER), useKnex, wrapAsync(async (req, res) => {
    await req.knex.transaction(async (knex) => {
      const additionalReviewer = await AdditionalReviewerDB.getReviewerForDisclosureAndUser(
        knex,
        req.userInfo.schoolId,
        req.params.disclosureId
      );
      const dates = JSON.parse(additionalReviewer[0].dates);
      dates.push({type: DATE_TYPE.COMPLETED, date: new Date()});
      const updates = {
        active: false,
        dates
      };
      await AdditionalReviewerDB.updateAdditionalReviewer(
        knex,
        additionalReviewer[0].id,
        updates
      );
      try {
        createAndSendReviewCompleteNotification(
          req.dbInfo,
          req.hostname,
          req.headers.authorization,
          req.userInfo,
          additionalReviewer[0].id
        );
      } catch (err) {
        Log.error(err,req);
      }
    });
    res.sendStatus(OK);
  }));

  app.get('/api/coi/reviewers', allowedRoles([ADMIN, REVIEWER]), wrapAsync(async (req, res) => {
    const results = await getReviewers(req.dbInfo, req.headers.authorization);
    res.send(results);
  }));

  app.get('/api/coi/reviewers/disclosures', allowedRoles('ANY'), useKnex, wrapAsync(async (req, res) => {
    const results = await AdditionalReviewerDB.getDisclosuresForReviewer(
      req.knex,
      req.userInfo.schoolId
    );
    res.send(results);
  }));

  app.get('/api/coi/reviewers/:disclosureId', allowedRoles(ADMIN), useKnex, wrapAsync(async (req, res) => {
    if (!req.query.term) {
      res.send([]);
      return;
    }
    const results = await getReviewers(req.dbInfo, req.headers.authorization);
    const existingReviewers = await AdditionalReviewerDB.getReviewerForDisclosureAndUser(
      req.knex,
      undefined,
      req.params.disclosureId
    );
    res.send(results.filter(result => {
      return result.value.toLowerCase().indexOf(req.query.term.toLowerCase()) >= 0 &&
          !existingReviewers.map(reviewer => {
            return reviewer.userId;
          }).includes(result.userId);
    }));
  }));

  app.put('/api/coi/reviewers/:disclosureId/recommend/:declarationId', allowedRoles([REVIEWER]), useKnex, wrapAsync(async (req, res) => {
    await req.knex.transaction(async (knex) => {
      await AdditionalReviewerDB.saveRecommendation(
        knex,
        req.userInfo.schoolId,
        req.params.disclosureId,
        req.params.declarationId,
        req.body.dispositionCd
      );
    });
    res.sendStatus(ACCEPTED);
  }));

  app.put('/api/coi/reviewers/:disclosureId/recommendProject/:projectPersonId', allowedRoles([REVIEWER]), useKnex, wrapAsync(async (req, res) => {
    await req.knex.transaction(async (knex) => {
      await AdditionalReviewerDB.saveProjectRecommendation(
        knex,
        req.userInfo.schoolId,
        req.params.disclosureId,
        req.params.projectPersonId,
        req.body.dispositionTypeCd
      );
    });
    res.sendStatus(ACCEPTED);
  }));
};
