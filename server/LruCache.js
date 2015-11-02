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

import LRU from 'lru-cache';

let config;
let options = {
  length: function(n) { return n.length; }
};
try {
  let extensions = require('research-extensions');
  config = extensions.config;
  options.max = config.cacheMax || 500;
  options.maxAge = config.cacheMaxAge || 60000;
}
catch (err) {
  options.max = process.env.CACHE_MAX || 500;
  options.maxAge = process.env.CACHE_MAX_AGE || 60000;
}

let cache = LRU(options); // eslint-disable-line new-cap

export default cache;
