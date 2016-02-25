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
import { ROLES } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { OK } from '../../http-status-codes';
import wrapAsync from './wrap-async';

export const init = app => {
  app.post('/api/coi/additional-reviewers', allowedRoles(ADMIN), wrapAsync(async req => {
    return await AdditionalReviewerDB.createAdditionalReviewer(req.dbInfo, req.body);
  }));

  app.delete('/api/coi/additional-reviewers/:id', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    await AdditionalReviewerDB.deleteAdditionalReviewer(req.dbInfo, req.params.id);
    res.sendStatus(OK);
  }));

  app.delete('/api/coi/additional-reviewers/current/:disclosureId', allowedRoles(REVIEWER), wrapAsync(async (req, res) => {
    const additionalReviewer = await AdditionalReviewerDB.getReviewerForDisclosureAndUser(req.dbInfo, req.userInfo.schoolId, req.params.disclosureId);
    await AdditionalReviewerDB.deleteAdditionalReviewer(req.dbInfo, additionalReviewer[0].id);
    res.sendStatus(OK);
  }));
};
