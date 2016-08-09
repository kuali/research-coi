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

import * as localClient from './local-client';
import Log from '../../log';
import {LANES} from '../../../coi-constants';

let client = localClient;
try {
  const extensions = require('research-extensions').default;

  if (extensions.config.lane !== LANES.TEST) {
    client = extensions.client;
  }
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    Log.error(err);
  }
}

export function getFile(dbInfo, key, callback) {
  if (!client) {
    Log.error('No file service configured');
    return;
  }
  return client.getFile(dbInfo, key, callback);
}

export function deleteFile(key, callback) {
  if (!client) {
    Log.error('No file service configured');
    return;
  }
  client.deleteFile(key, callback);
}

