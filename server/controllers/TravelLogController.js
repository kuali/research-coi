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

import * as TravelLogDB from '../db/travel-log-d-b';
import Log from '../log';
import {OK} from '../../http-status-codes';

export const init = app => {
  /**
    @Role: user
    Can only see travel logs associated with their entities
  */
  app.get('/api/coi/travel-log-entries', (req, res, next) => {
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
    TravelLogDB.getTravelLogEntries(req.dbInfo, req.userInfo.schoolId, sortColumn, sortDirection, filter)
      .then(travelLog => {
        res.send(travelLog);
      })
    .catch(err => {
      Log.error(err);
      next(err);
    });

  });

  /**
   @Role: user
   Can only add travel logs associated with their entities
   */
  app.post('/api/coi/travel-log-entries', (req, res, next) => {
    TravelLogDB.createTravelLogEntry(req.dbInfo, req.body, req.userInfo)
      .then(travelLog => {
        res.send(travelLog);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
   @Role: user
   Can only delete travel logs associated with their entities
   */
  app.delete('/api/coi/travel-log-entries/:id', (req, res, next) => {
    TravelLogDB.deleteTravelLogEntry(req.dbInfo, req.params.id, req.userInfo)
      .then(() => {
        res.sendStatus(OK);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
   @Role: user
   Can only update travel logs associated with their entities
   */
  app.put('/api/coi/travel-log-entries/:id', (req, res, next) => {
    TravelLogDB.updateTravelLogEntry(req.dbInfo, req.body, req.params.id, req.userInfo)
    .then(travelLog => {
      res.send(travelLog);
    })
    .catch(err => {
      Log.error(err);
      next(err);
    });
  });
};
