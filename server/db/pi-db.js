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

const MAX_ROWS = 10;

function queryUsingIndexOracle(knex, term) {
  return knex.distinct('submitted_by as value')
      .from('disclosure as d')
      .whereRaw('LOWER("submitted_by") LIKE ?', `%${term.toLowerCase()}%`)
      .limit(MAX_ROWS);
}

function queryWithoutIndexOracle(knex, term) {
  return knex.distinct('submitted_by as value')
      .from('disclosure as d')
      .whereRaw('LOWER("submitted_by") LIKE ?', `%${term.toLowerCase()}%`)
      .limit(MAX_ROWS);
}

function queryUsingIndexMySQL(knex, term) {
  return knex
      .distinct('submitted_by as value')
      .from('disclosure as d')
      .andWhere('submitted_by', 'LIKE', `${term}%`)
      .limit(MAX_ROWS);
}

function queryWithoutIndexMySQL(knex, term) {
  return knex
      .distinct('submitted_by as value')
      .from('disclosure as d')
      .andWhere('submitted_by', 'LIKE', `%${term}%`)
      .limit(MAX_ROWS);
}

function addReviewerCriteria(query, schoolId) {
  return query
    .leftJoin('additional_reviewer as ar', 'ar.disclosure_id', 'd.id')
    .andWhere({'ar.user_id': schoolId});
}

function checkTerm(term) {
  const reg = new RegExp('^[-\'.a-zA-Z ]+$');
  return reg.test(term);
}

export async function getSuggestions(knex, term, userInfo) {
  try {
    let indexQuery;
    let noIndexQuery;
    let result;
    if (knex.dbType === 'mysql') {
      indexQuery = queryUsingIndexMySQL(knex, term);
      noIndexQuery = queryWithoutIndexMySQL(knex, term);
      result = await addReviewerCriteriaAndSearch(userInfo, indexQuery, noIndexQuery);
    } else if (checkTerm(term)) {
      indexQuery = queryUsingIndexOracle(knex, term);
      noIndexQuery = queryWithoutIndexOracle(knex, term);
      result = await addReviewerCriteriaAndSearch(userInfo, indexQuery, noIndexQuery);
    }
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function addReviewerCriteriaAndSearch(userInfo, indexQueryWithoutReviewer, noIndexQueryWithoutReviewer) {
  let indexQuery = indexQueryWithoutReviewer;
  let noIndexQuery = noIndexQueryWithoutReviewer;
  if (userInfo.coiRole === ROLES.REVIEWER) {
    indexQuery = addReviewerCriteria(indexQuery, userInfo.schoolId);
    noIndexQuery = addReviewerCriteria(noIndexQuery, userInfo.schoolId);
  }

  const result = await indexQuery;
  if (result.length < MAX_ROWS) {
    return await noIndexQuery;
  }
  return result;
}