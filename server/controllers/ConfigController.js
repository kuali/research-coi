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

import * as ConfigDB from '../db/config-d-b';
import {COIConstants} from '../../coi-constants';
import {FORBIDDEN} from '../../http-status-codes';
import Log from '../log';
import wrapAsync from './wrap-async';

export async function saveConfig(req, res, next) {
  try {
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
  catch(err) {
    Log.error(err);
    next(err);
  }
}

export const init = app => {
  /**
    @Role: any
  */
  app.get('/api/coi/config', (req, res, next) => {
    ConfigDB.getConfig(req.dbInfo, req.userInfo.schoolId)
      .then(config => {
        res.send(config);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: any
   */
  app.get('/api/coi/archived-config/:id', (req, res, next) => {
    ConfigDB.getArchivedConfig(req.dbInfo, req.params.id)
    .then((result) => {
      res.send(JSON.parse(result[0].config));
    })
    .catch(err => {
      Log.error(err);
      next(err);
    });
  });

  /**
    @Role: admin
  */
  app.post('/api/coi/config/', wrapAsync(saveConfig));
};
