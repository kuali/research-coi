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

import getKnex from './db/connection-manager';
import {createLogger} from './log';
const log = createLogger('FeatureFlags');

async function initFeatureFlags(flags) {
  try {
    const knex = getKnex();

    await knex.transaction(async (knexTrx) => {
      await knexTrx('feature_flag')
        .del()
        .whereNotIn('key', flags);

      for (const flag of flags) {
        const row = await knexTrx
          .first('key')
          .from('feature_flag')
          .where('key', flag);

        if (!row) {
          await knexTrx('feature_flag')
            .insert({
              key: flag,
              active: false
            });
          log.info(`Added feature flag: ${flag} (Default off)`);
        }
      }
    });
  }
  catch (err) {
    log.error('Failed to initialize feature flags');
    log.error(err);
  }
}

export default function init(flags) {
  let initFunction;
  try {
    const extensions = require('research-extensions').default;
    initFunction = extensions.initFeatureFlags;
  }
  catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      log.error(err);
    }
    initFunction = initFeatureFlags;
  }

  initFunction(flags).then();
}

export async function flagIsOn(knex, key) {
  try {
    const row = await knex('feature_flag')
      .first('active')
      .where({key});

    if (row && row.active == true) {
      return true;
    }

    return false;
  }
  catch (err) {
    log.error(err);
    return false;
  }
}