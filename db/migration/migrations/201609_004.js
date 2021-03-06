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

/* eslint-disable prefer-arrow-callback, no-var,  camelcase */

exports.up = function(knex) {
  return knex.schema.createTable('general_comment', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.text('text').notNullable();
    table.string('user_id', 40).notNullable();
    table.string('user_role',40).notNullable();
    table.string('author', 50).notNullable();
    table.dateTime('date', true).notNullable();
    table.boolean('pi_visible');
    table.boolean('reviewer_visible');
    table.boolean('current');
    table.boolean('editable').defaultTo(true);
  });
};

exports.down = function() {
};
