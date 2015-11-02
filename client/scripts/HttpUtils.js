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

import defaults from 'superagent-defaults';
import cookies from 'cookies-js';

export function processResponse(callback) {
  return (err, res) => {
    if (!err) {
      callback(err, res);
    } else if (err.status === 401) {
      window.location = '/auth/';
    }
  };
}

export function createRequest() {
  let request = defaults();
  request.set('Authorization', 'Bearer ' + cookies.get('authToken'));
  return request;
}
