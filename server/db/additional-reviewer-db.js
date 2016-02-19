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

/* eslint-disable camelcase */

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./connection-manager').default;
}

export async function getDisclosuresForReviewer(dbInfo, schoolId) {
  const knex = getKnex(dbInfo);
  try {
    const reviewers = await knex('additional_reviewer')
      .select('disclosure_id as disclosureId')
      .where({user_id: schoolId});
    return reviewers.map(reviewer => {
      return reviewer.disclosureId.toString();
    });
  } catch(err) {
    return Promise.reject(err);
  }

}

export function getReviewerForDisclosureAndUser(dbInfo, schoolId, disclosureId) {
  const knex = getKnex(dbInfo);
  return knex('additional_reviewer')
    .select('id')
    .where({
      user_id: schoolId,
      disclosure_id: disclosureId
    });


}

export async function createAdditionalReviewer(dbInfo, reviewer) {
  const knex = getKnex(dbInfo);
  try {
    const id = await knex('additional_reviewer').insert({
      disclosure_id: reviewer.disclosureId,
      user_id: reviewer.userId,
      name: reviewer.name,
      email: reviewer.email,
      title: reviewer.title,
      unit_name: reviewer.unitName
    },'id');
    reviewer.id = id[0];
    return Promise.resolve(reviewer);
  } catch (err) {
    return Promise.reject(err);
  }
}

export const deleteAdditionalReviewer = (dbInfo, id) => {
  const knex = getKnex(dbInfo);
  return knex('additional_reviewer').del().where({id});
};
