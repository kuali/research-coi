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

import * as authClient from './authClient';
import * as mockAuthClient from './mockAuthClient';

let client;

try {
  let extensions = require('research-extensions'); // eslint-disable-line no-unused-vars
  client = authClient;
} catch (e) {
  client = process.env.AUTH_ENABLED === true ? authClient : mockAuthClient;
}


export function getUserInfo(dbInfo, hostname, authToken) {
  return client.getUserInfo(dbInfo, hostname, authToken);
}

export function getAuthLink(req) {
  return client.getAuthLink(req);
}

export function authView(req, res) {
  return client.authView(req, res);
}
