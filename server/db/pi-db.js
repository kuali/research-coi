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

import { ROLES } from '../../coi-constants';
import {addLoggers} from '../log';

const MAX_ROWS = 10;

const PIDB = {};
export default PIDB;

PIDB.queryUsingIndexOracle = function(knex, term) {
  return knex
    .distinct('submitted_by as value')
    .from('disclosure as d')
    .whereRaw('LOWER("submitted_by") LIKE ?', `%${term.toLowerCase()}%`)
    .limit(MAX_ROWS);
};

PIDB.queryWithoutIndexOracle = function(knex, term) {
  return knex
    .distinct('submitted_by as value')
    .from('disclosure as d')
    .whereRaw('LOWER("submitted_by") LIKE ?', `%${term.toLowerCase()}%`)
    .limit(MAX_ROWS);
};

PIDB.queryUsingIndexMySQL = function(knex, term) {
  return knex
    .distinct('submitted_by as value')
    .from('disclosure as d')
    .andWhere('submitted_by', 'LIKE', `${term}%`)
    .limit(MAX_ROWS);
};

PIDB.queryWithoutIndexMySQL = function(knex, term) {
  return knex
    .distinct('submitted_by as value')
    .from('disclosure as d')
    .andWhere('submitted_by', 'LIKE', `%${term}%`)
    .limit(MAX_ROWS);
};

PIDB.addReviewerCriteria = function(query, schoolId) {
  return query
    .leftJoin('additional_reviewer as ar', 'ar.disclosure_id', 'd.id')
    .andWhere({'ar.user_id': schoolId});
};

PIDB.checkTerm = function(term) {
  const reg = new RegExp('^[-\'.a-zA-Z ]+$');
  return reg.test(term);
};

PIDB.getSuggestions = async function(knex, term, userInfo) {
  let indexQuery;
  let noIndexQuery;
  if (knex.dbType === 'mysql') {
    indexQuery = PIDB.queryUsingIndexMySQL(knex, term);
    noIndexQuery = PIDB.queryWithoutIndexMySQL(knex, term);
  } else if (PIDB.checkTerm(term)) {
    indexQuery = PIDB.queryUsingIndexOracle(knex, term);
    noIndexQuery = PIDB.queryWithoutIndexOracle(knex, term);
  }
  return await PIDB.addReviewerCriteriaAndSearch(
    userInfo,
    indexQuery,
    noIndexQuery
  );
};

PIDB.addReviewerCriteriaAndSearch = async function(
    userInfo,
    indexQueryWithoutReviewer,
    noIndexQueryWithoutReviewer
  ) {
  let indexQuery = indexQueryWithoutReviewer;
  let noIndexQuery = noIndexQueryWithoutReviewer;
  if (userInfo.coiRole === ROLES.REVIEWER) {
    indexQuery = PIDB.addReviewerCriteria(indexQuery, userInfo.schoolId);
    noIndexQuery = PIDB.addReviewerCriteria(noIndexQuery, userInfo.schoolId);
  }

  const result = await indexQuery;
  if (result.length < MAX_ROWS) {
    return await noIndexQuery;
  }
  return result;
};

addLoggers({PIDB});
