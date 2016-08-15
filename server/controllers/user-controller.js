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

import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import Log from '../log';

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
      researchCoreUrl: process.env.RESEARCH_CORE_URL || 'https://uit.kuali.dev/res'
    };
  };
}

export const init = app => {
  app.get('/api/coi/userinfo', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const {
      schoolId: userId,
      firstName,
      lastName,
      displayName,
      coiRole,
      mock
    } = req.userInfo;

    res.send({
      userId,
      firstName,
      lastName,
      displayName,
      coiRole,
      mock,
      researchCoreUrl: getAuthorizationInfo(req.dbInfo).researchCoreUrl,
      version: process.env.npm_package_version
    });
  }));
};
