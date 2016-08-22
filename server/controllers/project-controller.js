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

import {
  saveProjects,
  getProjects,
  updateProjectPersonDispositionType,
  getProjectStatuses,
  getProjectStatus
} from '../db/project-db';
import { ROLES } from '../../coi-constants';
import { OK, BAD_REQUEST } from '../../http-status-codes';
const { ADMIN } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { filterProjects } from '../services/project-service/project-service';
import wrapAsync from './wrap-async';
import projectIsValid from '../validators/project';
import Log from '../log';
import useKnex from '../middleware/request-knex';

export const init = app => {
  app.post(
    '/api/coi/projects',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {body, knex} = req;
      if (!projectIsValid(body)) {
        res.status(BAD_REQUEST);
        res.json(projectIsValid.errors);
        Log.error(
          `An invalid project was pushed to /api/coi/projects
          ${JSON.stringify(projectIsValid.errors)}`
        );
        return;
      }

      let result;
      await knex.transaction(async (knexTrx) => {
        result = await saveProjects(knexTrx, req, body);
      });
      if (!result) {
        res.sendStatus(OK);
        return;
      }
      res.send(result);
    }
  ));

  /**
    Should only return projects associated with the given user
  */
  app.get(
    '/api/coi/projects',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo, query, dbInfo, headers}, res) =>
    {
      const projects = await getProjects(knex, userInfo.schoolId);
      if (query.filter) {
        const result = await filterProjects(
          dbInfo,
          projects,
          headers.authorization
        );
        res.send(result);
        return;
      }

      res.send(projects);
    }
  ));

  app.put(
    '/api/coi/project-persons-disposition-types/:id',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({body, params, knex}, res) =>
    {
      await knex.transaction(async (knexTrx) => {
        await updateProjectPersonDispositionType(
          knexTrx,
          body,
          params.id
        );
      });
      res.sendStatus(OK);
    }
  ));

  app.get(
    '/api/coi/project-disclosure-statuses/:sourceId/:projectId',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({dbInfo, knex, params, headers}, res) => {
      const {sourceId, projectId} = params;
      const result = await getProjectStatuses(
        dbInfo,
        knex,
        sourceId,
        projectId,
        headers.authorization
      );
      res.send(result);
    }
  ));

  app.get(
    '/api/coi/project-disclosure-statuses/:sourceId/:projectId/:personId',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({dbInfo, knex, params, headers}, res) =>
    {
      const {sourceId, projectId, personId} = params;
      const result = await getProjectStatus(
        dbInfo,
        knex,
        sourceId,
        projectId,
        personId,
        headers.authorization
      );
      res.send(result);
    }
  ));
};
