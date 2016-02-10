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

import Log from './log';
import {COIConstants} from '../coi-constants';
let getKnex;

const MILLIS_IN_A_DAY = 86400000;

async function checkForExpiredDisclosures(expiredCode) {
  try {
    Log.info('Checking for disclosures which have expired');
    const knex = getKnex();
    const numberExpired = await knex('disclosure')
      .whereNot('status_cd', expiredCode)
      .andWhere('expired_date', '<', new Date())
      .update({
        status_cd: expiredCode
      });

    Log.info(`${numberExpired} disclosures expired`);
  }
  catch(err) {
    Log.error(err);
  }
}

let expirationCheck;
try {
  const extensions = require('research-extensions').default;
  expirationCheck = extensions.expirationCheck;
}
catch (err) {
  getKnex = require('./db/connection-manager').default;
  expirationCheck = checkForExpiredDisclosures;
}

export default function scheduleExpirationCheck() {
  const waitUntilToRun = Math.random() * MILLIS_IN_A_DAY;
  setTimeout(() => {
    Log.info('Scheduled the expired disclosures check to run every 24 hours from now');
    expirationCheck(COIConstants.DISCLOSURE_STATUS.EXPIRED);
    setInterval(() => {
      expirationCheck(COIConstants.DISCLOSURE_STATUS.EXPIRED);
    }, MILLIS_IN_A_DAY);
  }, waitUntilToRun);
}
