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

/* eslint-disable */

import _ from 'lodash';

function izeJson(attrs, caseFunc) {
  if (!caseFunc) {
    throw new Error('must provide a case function');
  }

  if (!attrs) {
    return attrs;
  }

  return _.reduce(attrs, function(obj, val, key) {
    if (val instanceof Array) {
      val = _.map(val, function(e) {
        if (typeof e !== 'object') {
          return e;
        }
        return izeJson(e, caseFunc);
      });
    } else if (val instanceof Date) {
      obj[caseFunc(key)] = val;
    } else if (val instanceof Object) {
      val = izeJson(val, caseFunc);
    }
    obj[caseFunc(key)] = val;
    return obj;
  }, {});
}

/**
 * This takes json object in a non-camel case format and camel cases it.  It handles nested objects and arrays.  Passing null will return null.
 *
 * Example: input - {foo_bar: 'baz'}, output - {fooBar: 'baz'}
 */
export function camelizeJson(attrs) {
  return izeJson(attrs, _.camelCase);
}

/**
 * This takes json object in a non-snake case format and snake cases it.  It handles nested objects and arrays.  Passing null will return null.
 *
 * Example: input - {fooBar: 'baz'}, output - {foo_bar: 'baz'}
 */
export function snakeizeJson(attrs) {
  return izeJson(attrs, _.snakeCase);
}
