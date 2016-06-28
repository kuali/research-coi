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

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./connection-manager').default;
}

export const isDisclosureUsers = (dbInfo, disclosureId, userId) => {
  const knex = getKnex(dbInfo);
  return knex.select('user_id')
    .from('disclosure')
    .where({
      id: disclosureId,
      user_id: userId
    })
    .then(result => {
      return result.length > 0;
    });
};

export const isFinancialEntityUsers = (dbInfo, id, userId) => {
  const knex = getKnex(dbInfo);
  return knex.select('d.user_id')
    .from('fin_entity as fe')
    .innerJoin('disclosure as d', 'd.id', 'fe.disclosure_id')
    .where({
      'fe.id': id,
      'd.user_id': userId
    })
    .then(result => {
      return result.length > 0;
    });
};

export function getDisclosureForFinancialEntity(dbInfo, id) {
  const knex = getKnex(dbInfo);
  return knex('fin_entity')
    .select('disclosure_id as disclosureId')
    .where({id})
    .then(entity => {
      return entity[0].disclosureId;
    });
}

export const verifyRelationshipIsUsers = (dbInfo, userId, relationshipId) => {
  const knex = getKnex(dbInfo);

  return knex.select('')
  .from('relationship as r')
  .innerJoin('fin_entity as f', 'f.id', 'r.fin_entity_id')
  .innerJoin('disclosure as d', 'd.id', 'f.disclosure_id')
  .where({
    'd.user_id': userId,
    'r.id': relationshipId
  })
  .then(rows => {
    return rows.length > 0;
  });
};
