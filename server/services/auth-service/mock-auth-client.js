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

import {ROLES} from '../../../coi-constants';
import hashCode from '../../../hash';

export function authView(req, res) {
  res.sendFile('auth.html', {
    root: 'views'
  });
}

export function getUserInfo(dbInfo, hostname, token) {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    if (!token) {
      resolve();
    }
    let lowercaseToken = token.toLowerCase();
    let impersonator;

    if (lowercaseToken.startsWith('impersonating_')) {
      const split = token.split('_');
      impersonator = 'impersonator';
      token = split[1]; // eslint-disable-line no-param-reassign
      lowercaseToken = token.toLowerCase();
    }

    if (lowercaseToken.startsWith('a')) {
      resolve({
        id: hashCode(token),
        name: `Admin ${token}`,
        username: token,
        email: `${token}@email.com`,
        createdAt: 1259218800,
        updatedAt: 1259218800,
        role: 'admin',
        firstName: 'Admin',
        lastName: token,
        phone: '801-322-3323',
        schoolId: hashCode(token),
        coiRole: ROLES.ADMIN,
        impersonatedBy: impersonator,
        mock: true
      });
    }
    else if (lowercaseToken.startsWith('reviewer')) {
      resolve({
        id: hashCode(token),
        name: `Reviewer ${token}`,
        username: token,
        email: `${token}@email.com`,
        createdAt: 1259218800,
        updatedAt: 1259218800,
        role: 'admin',
        firstName: 'Reviewer',
        lastName: token,
        phone: '801-322-3323',
        schoolId: hashCode(token),
        coiRole: ROLES.REVIEWER,
        impersonatedBy: impersonator,
        mock: true
      });
    } else {
      resolve({
        id: hashCode(token),
        name: `User ${token}`,
        username: token,
        email: `${token}@email.com`,
        createdAt: 1259218800,
        updatedAt: 1259218800,
        role: 'user',
        firstName: 'User',
        lastName: token,
        phone: '801-322-3323',
        schoolId: hashCode(token),
        coiRole: ROLES.USER,
        impersonatedBy: impersonator,
        mock: true
      });
    }
  });
}

export async function getUserInfosByQuery(dbInfo, hostname, authToken, queryValue) {
  const result = await getUserInfo(dbInfo, hostname, queryValue);
  return [result];
}

export function getAuthLink(req) {
  const returnToValue = encodeURIComponent(req.originalUrl);
  return `/coi/auth?return_to=${returnToValue}`;
}

export async function getAdmins(dbInfo, authToken) {//eslint-disable-line no-unused-vars
  return Promise.resolve([
    {
      userId: hashCode('admin1'),
      displayName: 'Admin 1',
      email: 'admin1@email.com'
    },
    {
      userId: hashCode('admin2'),
      displayName: 'Admin 2',
      email: 'admin2@email.com'
    }
  ]);
}

export function getReviewers(dbInfo, authToken) { //eslint-disable-line no-unused-vars
  return Promise.resolve([
    {
      userId: hashCode('reviewer1'),
      value: 'reviewer1',
      email: 'reviewer1@email.com'
    },
    {
      userId: hashCode('reviewer2'),
      value: 'reviewer2',
      email: 'reviewer2@email.com'
    }
  ]);
}

