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

/* eslint-disable prefer-arrow-callback */

exports.up = function(knex) {
  return knex.schema.table('project_type', function(table) {
    table.boolean('req_disclosure').notNullable().defaultTo(false);
  }).createTable('project_role', function(table) {
    table.increments('type_cd').notNullable();
    table.integer('project_type_cd').notNullable().references('type_cd').inTable('project_type');
    table.string('source_role_cd', 50).notNullable();
    table.string('description', 50).notNullable();
    table.boolean('req_disclosure').notNullable().defaultTo(false);
  }).createTable('project_status', function(table) {
    table.increments('type_cd').notNullable();
    table.integer('project_type_cd').notNullable().references('type_cd').inTable('project_type');
    table.string('source_status_cd', 75).notNullable();
    table.string('description', 50).notNullable();
    table.boolean('req_disclosure').notNullable().defaultTo(false);
  });
};

exports.down = function() {
};
