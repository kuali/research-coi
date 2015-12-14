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

/*eslint camelcase:0 */

const MAX_ROWS = 10;

let getKnex;
try {
  const extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

const queryUsingIndex = (knex, term) => {
  return knex.distinct('submitted_by as value')
    .from('disclosure as d')
    .andWhere('submitted_by', 'LIKE', `${term}%`)
    .limit(MAX_ROWS);
};

const queryWithoutIndex = (knex, term) => {
  return knex.distinct('submitted_by as value')
    .from('disclosure as d')
    .andWhere('submitted_by', 'LIKE', `%${term}%`)
    .limit(MAX_ROWS);
};

export const getSuggestions = (dbInfo, term) => {
  const knex = getKnex(dbInfo);

  return queryUsingIndex(knex, term)
    .then(result => {
      if (result.length < MAX_ROWS) {
        return queryWithoutIndex(knex, term);
      }

      return result;
    });
};
