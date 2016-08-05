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

import fs from 'fs';
import path from 'path';

const filePath = process.env.LOCAL_FILE_DESTINATION || 'uploads/';

function cleanKey(key) {
  return key.replace(/(\.\.)|\/|\\/g, '');
}

export function getFile(dbInfo, key, callback) {
  const stream = fs.createReadStream(path.join(filePath, cleanKey(key)));
  stream.on('error', err => {
    callback(err);
  });
  return stream;
}

export function deleteFile(key, callback) {
  fs.unlink(path.join(filePath, cleanKey(key)), err => {
    callback(err);
  });
}
