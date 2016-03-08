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

import * as ProjectDB from '../db/project-db';
import { ROLES } from '../../coi-constants';
import { OK } from '../../http-status-codes';
const { ADMIN } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { filterProjects } from '../services/project-service/project-service';
import wrapAsync from './wrap-async';

export const init = app => {
  app.post('/api/coi/projects', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    const result = await ProjectDB.saveProjects(req.dbInfo, req.body);
    if (!result) {
      res.sendStatus(OK);
      return;
    }
    res.send(result);
  }));

  /**
    Should only return projects associated with the given user
  */
  app.get('/api/coi/projects', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const projects = await ProjectDB.getProjects(req.dbInfo, req.userInfo.schoolId);
    if (req.query.filter) {
      const result = await filterProjects(req.dbInfo, projects, req.headers.authorization);
      res.send(result);
      return;
    }

    res.send(projects);
  }));

  app.get('/api/coi/project-disclosure-statuses/:sourceId/:projectId', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    const result = await ProjectDB.getProjectStatuses(req.dbInfo, req.params.sourceId, req.params.projectId);
    res.send(result);
  }));

  app.get('/api/coi/project-disclosure-statuses/:sourceId/:projectId/:personId', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    const result = await ProjectDB.getProjectStatus(req.dbInfo, req.params.sourceId, req.params.projectId, req.params.personId);
    res.send(result);
  }));
};
