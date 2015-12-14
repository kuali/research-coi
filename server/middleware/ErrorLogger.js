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

import Log from '../Log';
import {INTERNAL_SERVER_ERROR} from '../../HTTPStatusCodes';

export default function(err, req, res, next) {
  Log.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(INTERNAL_SERVER_ERROR);
  res.send('<html><body>Error</body></html>');
}
