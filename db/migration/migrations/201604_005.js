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
  return knex.schema
    .table('disclosure', function(table) {
      table.dropForeign('disposition_type_cd');
    })
    .table('disclosure', function(table) {
      table.dropColumn('disposition_type_cd');
    })
    .dropTableIfExists('disposition_type')
    .createTable('disposition_type', function(table) {
      table.increments('type_cd').notNullable().primary();
      table.string('description', 50).notNullable();
      table.integer('order').notNullable();
      table.boolean('active').notNullable();
      table.engine('InnoDB');
    })
    .table('declaration', function(table) {
      table.integer('disposition_type_cd').unsigned().references('type_cd').inTable('disposition_type');
    });
};

exports.down = function() {
};
