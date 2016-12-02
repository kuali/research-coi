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

/* eslint-disable prefer-arrow-callback, camelcase */

exports.up = function(knex) {
  return knex.schema.table('relationship_type', function(table) {
    table.integer('order').notNullable();
  }).then(() => {
    return knex
      .select(
        'type_cd',
        'relationship_cd'
      )
      .from('relationship_type')
      .where({
        active: true
      })
      .orderBy('relationship_cd')
      .orderBy('type_cd');
  }).then(relationshipTypes => {
    let i = -1;
    return Promise.all(
      relationshipTypes.map(rt => {
        i++;
        return knex('relationship_type')
          .update('order', Number(i))
          .where({type_cd: rt.type_cd});
      })
    );
  }).then(() => {
    return knex.schema.table('relationship_amount_type', function(table) {
      table.integer('order').notNullable();
    });
  }).then(() => {
    return knex
      .select(
        'type_cd',
        'relationship_cd'
      )
      .from('relationship_amount_type')
      .where({
        active: true
      })
      .orderBy('relationship_cd')
      .orderBy('type_cd');
  }).then(amountTypes => {
    let i = -1;
    return Promise.all(
      amountTypes.map(rt => {
        i++;
        return knex('relationship_amount_type')
          .update('order', Number(i))
          .where({type_cd: rt.type_cd});
      })
    );
  }).then(() => {
    return knex.schema.table('relationship_person_type', function(table) {
      table.integer('order').notNullable();
    });
  }).then(() => {
    return knex
      .select('type_cd')
      .from('relationship_person_type')
      .where({
        active: true
      })
      .orderBy('type_cd');
  }).then(amountTypes => {
    let i = -1;
    return Promise.all(
      amountTypes.map(rt => {
        i++;
        return knex('relationship_person_type')
          .update('order', Number(i))
          .where({type_cd: rt.type_cd});
      })
    );
  });
};

exports.down = function() {
};
