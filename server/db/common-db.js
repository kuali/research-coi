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

export async function isDisclosureUsers(knex, disclosureId, userId) {
  const result = await knex
    .first('user_id')
    .from('disclosure')
    .where({
      id: disclosureId,
      user_id: userId
    });
  
  return result !== undefined;
}

export async function isFinancialEntityUsers(knex, id, userId) {
  const result = await knex
    .first('d.user_id')
    .from('fin_entity as fe')
    .innerJoin('disclosure as d', 'd.id', 'fe.disclosure_id')
    .where({
      'fe.id': id,
      'd.user_id': userId
    });

  return result !== undefined;
}

export async function getDisclosureForFinancialEntity(knex, id) {
  const entity = await knex('fin_entity')
    .first('disclosure_id as disclosureId')
    .where({id});

  return entity.disclosureId;
}

export async function verifyRelationshipIsUsers(knex, userId, relationshipId) {
  const rows = await knex
    .first('r.id')
    .from('relationship as r')
    .innerJoin('fin_entity as f', 'f.id', 'r.fin_entity_id')
    .innerJoin('disclosure as d', 'd.id', 'f.disclosure_id')
    .where({
      'd.user_id': userId,
      'r.id': relationshipId
    });

  return rows !== undefined;
}
