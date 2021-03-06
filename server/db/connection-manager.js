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

import knex from 'knex';
import {createLogger} from '../log';
const log = createLogger('ConnectionManager');

const DEFAULT_CONNECTION_POOL_SIZE = 70;

let connectionOptions;
if (process.env.DB_PACKAGE === 'mysql') {
  connectionOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'coi',
    charset: 'utf8'
  };
}
else {
  connectionOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'coi'
  };
  if (process.env.DB_PORT) {
    connectionOptions.host = `${connectionOptions.host}:${process.env.DB_PORT}`;
  }
}

if (process.env.NODE_ENV === 'test') {
  connectionOptions.password = process.env.TEST_DB_PASSWORD || '';
  connectionOptions.database = process.env.TEST_DB_NAME || 'coi_tst';
}

let useNullAsDefault = true;
if (process.env.USE_NULL_AS_DEFAULT) {
  useNullAsDefault = process.env.USE_NULL_AS_DEFAULT;
}

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  let knexInstance;
  if (err.code !== 'MODULE_NOT_FOUND') {
    log.error(err);
  }
  else {
    knexInstance = knex({
      client: process.env.DB_PACKAGE || 'oracledb',
      connection: connectionOptions,
      pool: {
        min: 2,
        max: process.env.CONNECTION_POOL_SIZE || DEFAULT_CONNECTION_POOL_SIZE
      },
      useNullAsDefault
    });
    knexInstance.dbType = process.env.DB_PACKAGE || 'oracledb';
  }
  getKnex = () => {
    return knexInstance;
  };
}

export default getKnex;
