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

/* eslint-disable camelcase */

import { LANES } from '../../coi-constants';
import getKnex from '../db/connection-manager';
import Log from '../log';

let lane;
try {
  const extensions = require('research-extensions').default;
  lane = extensions.config.lane;
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    Log.error(err);
  }
  lane = process.env.LANE || LANES.PRODUCTION;
}

function getRequestInfo(req) {
  if (req) {
    return `host=${req.hostname}, path=${req.url}, method=${req.method}, userName=${req.userInfo ? req.userInfo.username : ''}, impersonatedBy=${req.userInfo.impersonatedBy} - Impersonated Request `; //eslint-disable-line max-len
  }
  return '';
}

export default function(req, res, next) {
  try {
    if (lane === LANES.TEST && req.userInfo.impersonatedBy) {
      console.info(getRequestInfo(req)); //eslint-disable-line no-console
      const knex = getKnex(req.dbInfo);
      knex('impersonation_audit').insert({
        timestamp: new Date(),
        auth_id: req.userInfo.id,
        school_id: req.userInfo.schoolId,
        username: req.userInfo.username,
        impersonator_auth_id: req.userInfo.impersonatedBy,
        method: req.method,
        path: req.url,
        request_info: JSON.stringify({
          body: req.body
        })
      }, 'id').then();
    }
  } catch (err) {
    console.error(err); //eslint-disable-line no-console
  } finally {
    next();
  }
}
