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

import * as ProjectDB from '../db/ProjectDB';
import Log from '../Log';

export let init = app => {
  app.post('/api/coi/projects', function(req, res, next) {
    ProjectDB.saveProjects(req.dbInfo, req.body)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Should only return projects associated with the given user
  */
  app.get('/api/coi/projects', function(req, res, next) {
    ProjectDB.getProjects(req.dbInfo, req.userInfo.schoolId)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });
};
