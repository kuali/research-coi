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

import ConfigDB from '../db/config-db';
import ProjectDB from '../db/project-db';
import { ROLES } from '../../coi-constants';
const { ADMIN } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import { getProjectData } from '../services/project-service/project-service';
import useKnex from '../middleware/request-knex';
import {handleNotifications} from '../expiration-check';

export async function saveConfig(req, res) {
  const {knex, dbInfo, body, hostname, userInfo} = req;

  let config;
  await knex.transaction(async (knexTrx) => {
    await ConfigDB.setConfig(
      dbInfo,
      knexTrx,
      userInfo.schoolId,
      body,
      hostname
    );
    config = await ConfigDB.getConfig(dbInfo, knexTrx, hostname);
    config.general = body.general;
    await ConfigDB.archiveConfig(
      knexTrx,
      userInfo.schoolId,
      userInfo.username,
      config
    );
  });

  res.send(config);

  await ProjectDB.updateAllProjectPersons(knex, req);
  await handleNotifications();
}

export const init = app => {
  app.get(
    '/api/coi/config',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({dbInfo, knex, hostname}, res) =>
    {
      const result = await ConfigDB.getConfig(dbInfo, knex, hostname);
      res.send(result);
    }
  ));

  app.get(
    '/api/coi/archived-config/:id',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, params}, res) =>
    {
      const result = await ConfigDB.getArchivedConfig(knex, params.id);
      res.send(result);
    }
  ));

  app.post(
    '/api/coi/config/',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(saveConfig)
  );

  app.get(
    '/api/coi/new-project-data/:projectTypeCd',
    allowedRoles(ADMIN),
    wrapAsync(async ({dbInfo, headers, params}, res) =>
    {
      const result = await getProjectData(
        dbInfo,
        headers.authorization,
        params.projectTypeCd
      );
      res.send(result);
    }
  ));
};
