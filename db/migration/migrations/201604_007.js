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

/* eslint-disable prefer-arrow-callback, camelcase, no-var */

exports.up = function(knex) {
  return knex.schema.table('declaration_type', function(table) {
    table.integer('order').notNullable().defaultTo(999);
  })
    .then(function() {
      return knex('declaration_type').select('*').where({active: 1}).then(function(types) {
        var order = 0;
        var queries = types.map(function(type) {
          var update;
          if (type.type_cd === 1) {
            update = types.length - 1;

          } else if (type.type_cd === 2) {
            update = 0;
          } else {
            update = order + 1;
            order = order + 1;
          }
          return knex('declaration_type').update({order: update}).where({type_cd: type.type_cd});
        });
        return Promise.all(queries);
      });
    })
    .then(function() {
      return knex.schema.table('declaration_type', function(table) {
        table.dropColumn('enabled');
      })
        .table('declaration_type', function(table) {
          table.dropColumn('custom');
        });
    });
};

exports.down = function() {
};
