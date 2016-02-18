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
import { getReviewers } from '../services/auth-service/auth-service';
import { ROLES } from '../../coi-constants';
const { ADMIN } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';

export const init = app => {
  app.get('/api/coi/userinfo', allowedRoles('ANY'), wrapAsync(async req => {
    return {
      firstName: req.userInfo.firstName,
      lastName: req.userInfo.lastName,
      coiRole: req.userInfo.coiRole,
      mock: req.userInfo.mock
    };
  }));

  app.get('/api/coi/reviewers', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    if (!req.query.term) {
      res.send([]);
      return;
    }
    const results = await getReviewers(req.dbInfo, req.headers.authorization);
    res.send(results.filter(result => result.value.toLowerCase().indexOf(req.query.term.toLowerCase()) >= 0 ));
  }));
};
