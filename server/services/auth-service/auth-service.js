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
let client;
try {
  const extensions = require('research-extensions').default; // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV === 'test') {
    client = require('./mock-auth-client');
  } else {
    client = require('./auth-client');
  }
} catch (e) {
  client = process.env.AUTH_ENABLED && process.env.AUTH_ENABLED === 'true' ? require('./auth-client') : require('./mock-auth-client');
}


export function getUserInfo(dbInfo, hostname, authToken) {
  return client.getUserInfo(dbInfo, hostname, authToken);
}

export function getUserInfosByQuery(dbInfo, hostname, authToken, queryValue) {
  return client.getUserInfosByQuery(dbInfo, hostname, authToken, queryValue);
}
export function getAuthLink(req) {
  return client.getAuthLink(req);
}

export function authView(req, res) {
  return client.authView(req, res);
}

export function getReviewers(dbInfo, authHeader) {
  return client.getReviewers(dbInfo, getAuthToken(authHeader));
}

export function getAdmins(dbInfo, authHeader) {
  return client.getAdmins(dbInfo, getAuthToken(authHeader));
}

export function getAuthToken(header) {
  try {
    const parsedHeader = header.split(' ');
    if (parsedHeader[0] === 'Bearer') {
      return parsedHeader[1];
    }

    return undefined;
  } catch(e) {
    return undefined;
  }
}