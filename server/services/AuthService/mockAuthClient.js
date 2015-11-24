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

import {COIConstants} from '../../../COIConstants';
export function authView(req, res) {
  res.sendFile('auth.html', {
    root: 'views'
  });
}

function hashCode(toHash){
  var hash = 0;
  if (toHash.length === 0) { return hash; }
  for (let i = 0; i < toHash.length; i++) {
    let char = toHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function getUserInfo(dbInfo, hostname, token) {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    if (!token) {
      resolve();
    }
    let lowercaseToken = token.toLowerCase();
    if (lowercaseToken.startsWith('a')) {
      resolve({
        id: hashCode(token),
        name: 'Admin ' + token,
        username: token,
        email: token + '@email.com',
        createdAt: 1259218800,
        updatedAt: 1259218800,
        role: 'admin',
        firstName: 'Admin',
        lastName: token,
        phone: '801-322-3323',
        schoolId: hashCode(token),
        coiRole: COIConstants.ROLES.ADMIN,
        mock: true
      });
    }
    else {
      resolve({
        id: hashCode(token),
        name: 'User ' + token,
        username: token,
        email: token + '@email.com',
        createdAt: 1259218800,
        updatedAt: 1259218800,
        role: 'user',
        firstName: 'User',
        lastName: token,
        phone: '801-322-3323',
        schoolId: hashCode(token),
        coiRole: COIConstants.ROLES.USER,
        mock: true
      });
    }
  });
}

export function getAuthLink(req) {
  let returnToValue = encodeURIComponent(req.protocol + '://' + req.hostname + req.originalUrl);
  return '/coi/auth?return_to=' + returnToValue;
}

