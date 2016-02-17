/*
 The Conflict of Interest (COI) module of Kuali Research
 Copyright © 2015 Kuali, Inc.

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
import { OK, FORBIDDEN } from '../../http-status-codes';
import wrapAsync from './wrap-async';

export const init = app => {
  /**
   @Role: admin
   */
  app.post('/api/coi/additional-reviewers', wrapAsync(async (req, res) => {
    if (req.userInfo.coiRole !== ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return undefined;
    }

    return await AdditionalReviewerDB.createAdditionalReviewer(req.dbInfo, req.body);
  }));

  /**
   @Role: admin
   */
  app.delete('/api/coi/additional-reviewers/:id', wrapAsync(async (req, res) => {
    if (req.userInfo.coiRole !== ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    await AdditionalReviewerDB.deleteAdditionalReviewer(req.dbInfo, req.params.id);
    res.sendStatus(OK);
  }));

  /**
   @Role: reviewer
   */
  app.delete('/api/coi/additional-reviewers/current/:disclosureId', wrapAsync(async (req, res) => {
    if (req.userInfo.coiRole !== ROLES.REVIEWER) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    const additionalReviewer = await AdditionalReviewerDB.getReviewerForDisclosureAndUser(req.dbInfo, req.userInfo.schoolId, req.params.disclosureId);
    await AdditionalReviewerDB.deleteAdditionalReviewer(req.dbInfo, additionalReviewer[0].id);
    res.sendStatus(OK);
  }));
};
