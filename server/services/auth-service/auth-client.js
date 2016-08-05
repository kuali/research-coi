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

import cache from '../../lru-cache';
import { ROLES, SYSTEM_USER } from '../../../coi-constants';
import request from 'superagent';
import Log from '../../log';
const useSSL = process.env.AUTH_OVER_SSL !== 'false';
const REVIEWER_CACHE_KEY = 'reviewers';
const ADMIN_CACHE_KEY = 'admins';
const SERVICE_ROLE = 'service';
let getAuthorizationInfo;
try {
  const extensions = require('research-extensions').default;
  getAuthorizationInfo = extensions.getAuthorizationInfo;
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    Log.error(e);
  }
  getAuthorizationInfo = (dbInfo) => { //eslint-disable-line no-unused-vars
    return {
      adminRole: process.env.COI_ADMIN_ROLE || 'KC-COIDISCLOSURE:COI%20Administrator',
      reviewerRole: process.env.COI_REVIEWER_ROLE || 'KC-COIDISCLOSURE:COI%20Reviewer',
      researchCoreUrl: process.env.RESEARCH_CORE_URL || 'https://uit.kuali.dev/res',
      authUrl: process.env.AUTH_URL
    };
  };
}

const END_POINTS = {
  RESEARCH_USERS: '/research-common/api/v1/research-users/current/'
};

async function isUserInRole(researchCoreUrl, role, schoolId, authToken) {
  try {
    const response = await request.get(`${researchCoreUrl}/research-sys/api/v1/roles/${role}/principals/${schoolId}?qualification=unitNumber:*`)
      .set('Authorization', `Bearer ${authToken}`);

    if (response.ok && Array.isArray(response.body) && response.body[0]) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  } catch (err) {
    Log.warn(`user ${schoolId} is not a member of the ${role} role`);
    return Promise.resolve(false);
  }
}

async function getUserRoles(dbInfo, schoolId, authToken) {
  const authInfo = getAuthorizationInfo(dbInfo);
  const isAdmin = await isUserInRole(authInfo.researchCoreUrl, authInfo.adminRole, schoolId, authToken);
  if (isAdmin) {
    return ROLES.ADMIN;
  }

  const isReviewer = await isUserInRole(authInfo.researchCoreUrl, authInfo.reviewerRole, schoolId, authToken);
  if (isReviewer) {
    return ROLES.REVIEWER;
  }

  return ROLES.USER;
}

async function getResearchUser(researchCoreUrl, authToken) {
  try {
    const response = await request.get(`${researchCoreUrl}${END_POINTS.RESEARCH_USERS}`)
     .set('Authorization', `Bearer ${authToken}`);
    return Promise.resolve(response.body);
  } catch (err) {
    return Promise.resolve({});
  }
}

export async function getUserInfo(dbInfo, hostname, authToken) {
  try {
    const cachedUserInfo = authToken ? cache.get(`${authToken}:${hostname}`) : undefined;
    if (cachedUserInfo) {
      return Promise.resolve(cachedUserInfo);
    }
    const authInfo = getAuthorizationInfo(dbInfo);
    const url = authInfo.authUrl || (useSSL ? 'https://' : 'http://') + hostname;
    const response = await request.get(`${url}/api/v1/users/current`)
      .set('Authorization', `Bearer ${authToken}`);

    const userInfo = response.body;
    if (userInfo.role === SERVICE_ROLE) {
      userInfo.coiRole = ROLES.ADMIN;
      userInfo.schoolId = SYSTEM_USER;
    } else {
      const role = await getUserRoles(dbInfo, userInfo.schoolId, authToken);

      if (!role) {
        userInfo.coiRole = ROLES.USER;
      } else {
        userInfo.coiRole = role;
      }
      const researchUser = await getResearchUser(authInfo.researchCoreUrl, authToken);

      userInfo.primaryDepartmentCode = researchUser.primaryDepartmentCode;
    }
    cache.set(`${authToken}:${hostname}`, userInfo);
    return Promise.resolve(userInfo);
  } catch (err) {
    return Promise.resolve();
  }
}

/*
  request will return an array with possible multiple userInfos
  will need to further filter once returned.
 */
export async function getUserInfosByQuery(dbInfo, hostname, authToken, queryValue) {
  try {
    const cachedUserInfo = queryValue ? cache.get(queryValue) : undefined;
    if (cachedUserInfo) {
      return Promise.resolve(cachedUserInfo);
    }
    const authInfo = getAuthorizationInfo(dbInfo);
    const url = authInfo.authUrl || (useSSL ? 'https://' : 'http://') + hostname;
    const response = await request.get(`${url}/api/v1/users/`)
      .query({q: queryValue.trim()})
      .set('Authorization', `Bearer ${authToken}`);

    const userInfo = response.body;
    cache.set(queryValue, userInfo);
    return Promise.resolve(userInfo);
  } catch (err) {
    return Promise.resolve();
  }
}

export function getAuthLink(req) {
  const authInfo = getAuthorizationInfo(req.dbInfo);
  const url = authInfo.authUrl || '';
  const returnLink = url ?
  (useSSL ? 'https://' : 'http://') + req.hostname + req.url :
    `/coi${req.path}`;
  return `${url}/auth?return_to=${encodeURIComponent(returnLink)}`;
}

export async function getReviewers(dbInfo, authToken, unit) {
  const authInfo = getAuthorizationInfo(dbInfo);
  return await getUsersInRole(authInfo.researchCoreUrl, authToken, authInfo.reviewerRole, REVIEWER_CACHE_KEY, unit);
}

export async function getAdmins(dbInfo, authToken, unit) {
  const authInfo = getAuthorizationInfo(dbInfo);
  return await getUsersInRole(authInfo.researchCoreUrl, authToken, authInfo.adminRole, ADMIN_CACHE_KEY, unit);
}

export async function getUsersInRole(url, authToken, role, cacheKey, unit) {
  try {
    const query = {};

    if (unit) {
      cacheKey = `cacheKey${unit}`; // eslint-disable-line no-param-reassign
      query.qualification = `unitNumber:${unit}`;
    }
    const cachedReviewers = cache.get(cacheKey);
    if (cachedReviewers) {
      return Promise.resolve(cachedReviewers);
    }
    const response = await request.get(`${url}/research-sys/api/v1/roles/${role}/principals/`)
      .query(query)
      .set('Authorization', `Bearer ${authToken}`);

    if (!response.ok) {
      return Promise.resolve();
    }
    const reviewers = response.body;
    const results = reviewers.map(reviewer => {
      return {
        userId: reviewer.memberId,
        value: reviewer.fullName,
        email: reviewer.email
      };
    });
    cache.set(REVIEWER_CACHE_KEY, results);
    return Promise.resolve(results);
  } catch (err) {
    return Promise.resolve([]);
  }
}

