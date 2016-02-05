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
import { getReviewers } from '../services/AuthService/AuthService';
import Log from '../Log';

export const init = app => {
  /**
    @Role: any
  */
  app.get('/api/coi/userinfo', (req, res) => {
    res.send({
      firstName: req.userInfo.firstName,
      lastName: req.userInfo.lastName,
      coiRole: req.userInfo.coiRole,
      mock: req.userInfo.mock
    });
  });

  /**
   @Role: any
   */
  app.get('/api/coi/reviewers', (req, res, next) => {
    if (!req.query.term) {
      res.send([]);
      return;
    }
    getReviewers(req.dbInfo, req.headers.authorization).then(results => {
      res.send(results.filter(result => result.value.toLowerCase().indexOf(req.query.term.toLowerCase()) >= 0 ));
    }).catch(err => {
      Log.error(err);
      next(err);
    });
  });
};
