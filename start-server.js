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

/* eslint-disable no-var, prefer-arrow-callback, prefer-template, no-console */

var fs = require('fs');

var directoryToUse = process.argv.length < 3 ? '' : process.argv[2];
var pathToBootstrap = './' + directoryToUse + '/server/bootstrap.js';
try {
  fs.accessSync(pathToBootstrap, fs.F_OK);
} catch(err) {
  console.error(pathToBootstrap + ' is not found or does not have permission');
  return;
}

require(pathToBootstrap);
