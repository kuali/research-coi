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

import cache from '../../LruCache';
import {COIConstants} from '../../../COIConstants';
import {OK} from '../../../HTTPStatusCodes';

const useSSL = process.env.AUTH_OVER_SSL !== 'false';
let http = useSSL ? require('https') : require('http');

let getAuthorizationInfo;
try {
  let extensions = require('research-extensions');
  getAuthorizationInfo = extensions.getAuthorizationInfo;
} catch (e) {
  getAuthorizationInfo = (dbInfo) => { //eslint-disable-line no-unused-vars
    return {
      host: process.env.AUTHZ_HOST || 'uit.kuali.dev',
      adminRole: process.env.AUTHZ_ADMIN_ROLE || 'KC-COIDISCLOSURE:COI%20Administrator'
    };
  };
}

function getUserRoles(dbInfo, schoolId, authToken) {
  return new Promise((resolve) => {
    let authInfo = getAuthorizationInfo(dbInfo);
    let options = {
      host: authInfo.host,
      path: '/kc-dev/kc-sys-krad/v1/roles/' + authInfo.adminRole + '/principals/' + schoolId + '?qualification=unitNumber:*',
      headers: {
        'Authorization': 'Bearer ' + authToken
      }
    };

    http.get(options, response => {
      if (response.statusCode === OK) {
        resolve(COIConstants.ROLES.ADMIN);
      } else {
        resolve(COIConstants.ROLES.USER);
      }
      response.on('error', () => {
        resolve(COIConstants.ROLES.USER);
      });
    }).on('error', () => {
      resolve(COIConstants.ROLES.USER);
    });
  });
}

export function getUserInfo(dbInfo, hostname, authToken) {
  return new Promise((resolve, reject) => {
    let cachedUserInfo = authToken ? cache.get(authToken) : undefined;
    if (cachedUserInfo) {
      resolve(cachedUserInfo);
    } else {
      let options = {
        host: hostname,
        path: '/api/users/current',
        headers: {
          'Accept': 'application/vnd.kuali.v1+json',
          'Authorization': 'Bearer ' + authToken
        }
      };

      http.get(options, response => {
        if (response.statusCode !== OK) {
          resolve();
        } else {
          let body = '';
          response.on('data', function (chunk) {
            body += chunk;
          });
          response.on('end', () => {
            let userInfo = JSON.parse(body);
            getUserRoles(dbInfo, userInfo.schoolId, authToken).then(role => {
              if (!role) {
                userInfo.coiRole = COIConstants.ROLES.USER;
              } else {
                userInfo.coiRole = role;
              }
              cache.set(authToken, userInfo);
              resolve(userInfo);
            }).catch(err => {
              reject(err);
            });
          });
          response.on('error', (err) => {
            reject(err);
          });
        }
      }).on('error', err => {
        reject(err);
      });
    }
  });
}

export function getAuthLink(req) {
  return '/auth?return_to=' + encodeURIComponent(req.originalUrl);
}
