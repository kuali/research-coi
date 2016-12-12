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

import {getUserInfo, getAuthToken} from '../services/auth-service/auth-service';
import {UNAUTHORIZED} from '../../http-status-codes';
import {createLogger} from '../log';
const log = createLogger('APIAuthentication');

export default function authentication(req, res, next) {
  let authToken = getAuthToken(req.headers.authorization);
  if (req.url.startsWith('/coi/files') && req.method === 'GET' && !authToken) {
    authToken = req.cookies.authToken;
  }

  getUserInfo(req.dbInfo, req.hostname, authToken)
    .then(userInfo => {
      if (!userInfo) {
        let ipAddresses;
        if (req.ips.length > 0) {
          ipAddresses = req.ips.toString();
        } else {
          ipAddresses = req.ip;
        }
        log.warn(`unauthenticated request from ${ipAddresses}`, req);
        res.sendStatus(UNAUTHORIZED);
      } else {
        req.userInfo = userInfo;
        next();
      }
    })
    .catch(err => {
      log.error(err);
      next(err);
    });
}
