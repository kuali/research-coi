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

import * as ConfigDB from '../db/config-db';
import { ROLES } from '../../coi-constants';
const { ADMIN } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import { getProjectData } from '../services/project-service/project-service';
import useKnex from '../middleware/request-knex';

export async function saveConfig(req, res) {
  await ConfigDB.setConfig(req.dbInfo, req.userInfo.schoolId, req.body, req.hostname);
  const config = await ConfigDB.getConfig(req.dbInfo, req.hostname);
  config.general = req.body.general;
  await ConfigDB.archiveConfig(req.dbInfo, req.userInfo.schoolId, req.userInfo.username, config);

  res.send(config);
}

export const init = app => {
  app.get('/api/coi/config', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await ConfigDB.getConfig(req.dbInfo, req.hostname);
    res.send(result);
  }));

  app.get('/api/coi/archived-config/:id', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await ConfigDB.getArchivedConfig(req.dbInfo, req.params.id);
    res.send(result);
  }));

  app.post('/api/coi/config/', allowedRoles(ADMIN), wrapAsync(saveConfig));

  app.get('/api/coi/new-project-data/:projectTypeCd', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    const result = await getProjectData(req.dbInfo, req.headers.authorization, req.params.projectTypeCd);
    res.send(result);
  }));
};
