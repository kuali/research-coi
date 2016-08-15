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

import * as TravelLogDB from '../db/travel-log-db';
import {OK} from '../../http-status-codes';
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import useKnex from '../middleware/request-knex';

export const init = app => {
  /**
    User can only see travel logs associated with their entities
  */
  app.get('/api/coi/travel-log-entries', allowedRoles('ANY'), useKnex, wrapAsync(async (req, res) => {
    let sortColumn = 'name';
    if (req.query.sortColumn) {
      sortColumn = req.query.sortColumn;
    }
    let sortDirection = 'ASCENDING';
    if (req.query.sortDirection) {
      sortDirection = req.query.sortDirection;
    }
    let filter = 'all';
    if (req.query.filter) {
      filter = req.query.filter;
    }
    const result = await TravelLogDB.getTravelLogEntries(
      req.knex,
      req.userInfo.schoolId,
      sortColumn,
      sortDirection,
      filter
    );
    res.send(result);
  }));

  /**
   User can only add travel logs associated with their entities
   */
  app.post('/api/coi/travel-log-entries', allowedRoles('ANY'), useKnex, wrapAsync(async (req, res) => {
    const result = await TravelLogDB.createTravelLogEntry(
      req.knex,
      req.body,
      req.userInfo
    );
    res.send(result);
  }));

  /**
   User can only delete travel logs associated with their entities
   */
  app.delete('/api/coi/travel-log-entries/:id', allowedRoles('ANY'), useKnex, wrapAsync(async (req, res) => {
    await TravelLogDB.deleteTravelLogEntry(
      req.dbInfo,
      req.knex,
      req.params.id,
      req.userInfo
    );
    res.sendStatus(OK);
  }));

  /**
   User can only update travel logs associated with their entities
   */
  app.put('/api/coi/travel-log-entries/:id', allowedRoles('ANY'), useKnex, wrapAsync(async (req, res) => {
    const result = await TravelLogDB.updateTravelLogEntry(
      req.dbInfo,
      req.knex,
      req.body,
      req.params.id,
      req.userInfo
    );
    res.send(result);
  }));
};
