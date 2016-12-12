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

import { ROLES } from '../../coi-constants';
const { ADMIN } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import useKnex from '../middleware/request-knex';
import FeaturesDB from '../db/features-db';
import {ACCEPTED} from '../../http-status-codes';

export const init = app => {
  app.get(
    '/api/coi/features',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({knex}, res) => {
      const flags = await FeaturesDB.getFeatureFlags(knex);
      res.send(flags);
    })
  );

  app.put(
    '/api/coi/features/:key',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({knex, params, body}, res) =>
    {
      await FeaturesDB.setFeatureFlagState(
        knex,
        params.key,
        body.active === true
      );
      res.sendStatus(ACCEPTED);
    }
  ));
};
