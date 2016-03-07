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
import { OK } from '../../http-status-codes';
import wrapAsync from './wrap-async';

export const init = app => {
  app.post('/api/coi/additional-reviewers', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    const result = await AdditionalReviewerDB.createAdditionalReviewer(req.dbInfo, req.body);
    res.send(result);
  }));

  app.delete('/api/coi/additional-reviewers/:id', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    await AdditionalReviewerDB.deleteAdditionalReviewer(req.dbInfo, req.params.id);
    res.sendStatus(OK);
  }));

  app.put('/api/coi/additional-reviewers/:id', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    await AdditionalReviewerDB.updateAdditionalReviewer(req.dbInfo, req.params.id, req.body);
    res.sendStatus(OK);
  }));

  app.put('/api/coi/additional-reviewers/complete-review/:disclosureId', allowedRoles(REVIEWER), wrapAsync(async (req, res) => {
    const additionalReviewer = await AdditionalReviewerDB.getReviewerForDisclosureAndUser(req.dbInfo, req.userInfo.schoolId, req.params.disclosureId);
    const dates = JSON.parse(additionalReviewer[0].dates);
    dates.push({type: DATE_TYPE.COMPLETED, date: new Date()});
    const updates = {
      active: false,
      dates
    };
    await AdditionalReviewerDB.updateAdditionalReviewer(req.dbInfo, additionalReviewer[0].id, updates);
    res.sendStatus(OK);
  }));

  app.get('/api/coi/reviewers/:disclosureId', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    if (!req.query.term) {
      res.send([]);
      return;
    }
    const results = await getReviewers(req.dbInfo, req.headers.authorization);
    const existingReviewers = await AdditionalReviewerDB.getReviewerForDisclosureAndUser(req.dbInfo, undefined, req.params.disclosureId);
    res.send(results.filter(result => {
      return result.value.toLowerCase().indexOf(req.query.term.toLowerCase()) >= 0 &&
          !existingReviewers.map(reviewer => {
            return reviewer.userId;
          }).includes(result.userId);
    }));
  }));
};
