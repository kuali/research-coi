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

import * as ConfigDB from '../db/config-db';
import {COIConstants} from '../../coi-constants';
import {FORBIDDEN} from '../../http-status-codes';
import wrapAsync from './wrap-async';
import { getProjectData } from '../services/project-service/project-service';

export async function saveConfig(req, res) {
  if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
    res.sendStatus(FORBIDDEN);
    return;
  }

  await ConfigDB.setConfig(req.dbInfo, req.userInfo.schoolId, req.body);
  const config = await ConfigDB.getConfig(req.dbInfo, req.userInfo.schoolId);
  config.general = req.body.general;
  await ConfigDB.archiveConfig(req.dbInfo, req.userInfo.schoolId, req.userInfo.username, config);

  res.send(config);
}

export const init = app => {
  /**
    @Role: any
  */
  app.get('/api/coi/config', wrapAsync(async req => {
    return await ConfigDB.getConfig(req.dbInfo, req.userInfo.schoolId);
  }));

  /**
    @Role: any
   */
  app.get('/api/coi/archived-config/:id', wrapAsync(async (req, res) => {
    const result = await ConfigDB.getArchivedConfig(req.dbInfo, req.params.id);
    res.send(JSON.parse(result[0].config));
  }));

  /**
    @Role: admin
  */
  app.post('/api/coi/config/', wrapAsync(saveConfig));

  /**
    @Role: ????????????
  */
  app.get('/api/coi/new-project-data/:projectTypeCd', wrapAsync(async req => {
    return await getProjectData(req.dbInfo, req.headers.authorization, req.params.projectTypeCd);
  }));
};
