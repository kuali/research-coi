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

import {ROLES} from '../../coi-constants';
import {FORBIDDEN} from '../../http-status-codes';
import Log from '../log';

export function configCheck(req, res, next) {
  roleCheck([ROLES.ADMIN], req.userInfo.coiRole, res, next);
}

export function adminCheck(req, res, next) {
  roleCheck([ROLES.ADMIN, ROLES.REVIEWER], req.userInfo.coiRole, res, next);
}

function roleCheck(roles, role, res, next) {
  if (!roles.includes(role)) {
    res.render('unauthorized');
    return;
  }
  next();
}

const ANY_ROLE = 'ANY';

export function allowedRoles(rolesToAllow) {
  let valid;
  if (Array.isArray(rolesToAllow)) {
    valid = req => rolesToAllow.includes(req.userInfo.coiRole);
  }
  else if (typeof rolesToAllow === 'string') {
    if (rolesToAllow === ANY_ROLE) {
      valid = () => true;
    }
    else {
      valid = req => rolesToAllow === req.userInfo.coiRole;
    }
  }
  else {
    throw new Error('Invalid list of roles');
  }

  return (req, res, next) => {
    if (!valid(req)) {
      Log.error(`Unauthorized attempt to access ${req.originalUrl} by ${req.userInfo.username}`);
      res.sendStatus(FORBIDDEN);
      return;
    }

    next();
  };
}
