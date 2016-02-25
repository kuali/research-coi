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

import cache from '../../lru-cache';
import { ROLES } from '../../../coi-constants';
import {OK} from '../../../http-status-codes';
const useSSL = process.env.AUTH_OVER_SSL !== 'false';
const http = useSSL ? require('https') : require('http');
const REVIEWER_CACHE_KEY = 'reviewers';
const rejectUnauthorized = process.env.VERIFY_HTTPS_CERTIFICATE !== 'false';

let getAuthorizationInfo;
try {
  const extensions = require('research-extensions').default;
  getAuthorizationInfo = extensions.getAuthorizationInfo;
} catch (e) {
  getAuthorizationInfo = (dbInfo) => { //eslint-disable-line no-unused-vars
    return {
      host: process.env.AUTHZ_HOST || 'uit.kuali.dev',
      adminRole: process.env.AUTHZ_ADMIN_ROLE || 'KC-COIDISCLOSURE:COI%20Administrator',
      reviewerRole: process.env.AUTHZ_ADMIN_ROLE || 'KC-COIDISCLOSURE:COI%20Reviewer'
    };
  };
}

function isUserInRole(host, role, schoolId, authToken) {
  return new Promise((resolve) => {
    const options = {
      host,
      path: `/kc-dev/kc-sys-krad/v1/roles/${role}/principals/${schoolId}?qualification=unitNumber:*`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      rejectUnauthorized
    };

    http.get(options, response => {
      if (response.statusCode === OK) {
        resolve(true);
      } else {
        resolve(false);
      }
      response.on('error', () => {
        resolve(false);
      });
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function getUserRoles(dbInfo, schoolId, authToken) {
  const authInfo = getAuthorizationInfo(dbInfo);
  const isAdmin = await isUserInRole(authInfo.host, authInfo.adminRole, schoolId, authToken);
  if (isAdmin) {
    return ROLES.ADMIN;
  }

  const isReviewer = await isUserInRole(authInfo.host, authInfo.reviewerRole, schoolId, authToken);
  if (isReviewer) {
    return ROLES.REVIEWER;
  }

  return ROLES.USER;
}

export function getUserInfo(dbInfo, hostname, authToken) {
  return new Promise((resolve, reject) => {
    const cachedUserInfo = authToken ? cache.get(authToken) : undefined;
    if (cachedUserInfo) {
      resolve(cachedUserInfo);
    } else {
      const options = {
        host: hostname,
        path: '/api/v1/users/current',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        rejectUnauthorized
      };

      http.get(options, response => {
        if (response.statusCode !== OK) {
          resolve();
        } else {
          let body = '';
          response.on('data', (chunk) => {
            body += chunk;
          });
          response.on('end', async () => {
            try {
              const userInfo = JSON.parse(body);
              const role = await getUserRoles(dbInfo, userInfo.schoolId, authToken);
              if (!role) {
                userInfo.coiRole = ROLES.USER;
              } else {
                userInfo.coiRole = role;
              }

              cache.set(authToken, userInfo);
              resolve(userInfo);
            } catch(err) {
              reject(err);
            }
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
  return `/auth?return_to=${encodeURIComponent(req.originalUrl)}`;
}

export async function getReviewers(dbInfo, authToken) {
  return new Promise((resolve) => {
    const cachedReviewers = cache.get(REVIEWER_CACHE_KEY);
    if (cachedReviewers) {
      return resolve(cachedReviewers);
    }
    const authInfo = getAuthorizationInfo(dbInfo);
    const options = {
      host: authInfo.host,
      path: `/kc-dev/kc-sys-krad/v1/roles/${authInfo.reviewerRole}/principals`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      rejectUnauthorized
    };

    http.get(options, response => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        if (response.statusCode === OK) {
          const results = JSON.parse(body);
          const reviewers = results.map(result => {
            return {
              userId: result.memberId,
              value: result.fullName,
              email: result.email
            };
          });
          cache.set(REVIEWER_CACHE_KEY, reviewers);
          resolve(reviewers);
        }
        resolve();
      });
      response.on('error', () => {
        resolve();
      });
    }).on('error', () => {
      resolve();
    });
  });
}

