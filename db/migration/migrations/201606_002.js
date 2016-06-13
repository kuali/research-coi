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

/* eslint-disable prefer-arrow-callback, no-var */

exports.up = function(knex) {
  return knex.schema.createTable('project_sponsor', function(table) {
    table.increments('id').notNullable();
    table.integer('project_id').unsigned().notNullable().references('id').inTable('project');
    table.string('source_system', 20).notNullable();
    table.string('source_identifier', 50).notNullable();
    table.string('sponsor_cd', 6);
    table.string('sponsor_name', 200);
  }).then(function() {
    return knex.select(
        'id as project_id',
        'source_system',
        'source_identifier',
        'sponsor_cd',
        'sponsor_name'
      ).from('project');
  }).then(function(existingRows) {
    return new Promise(function(resolve) {
      var i = 0;

      function insertRow() {
        if (i < existingRows.length) {
          knex('project_sponsor').insert(existingRows[i]).then(insertRow);
          i++;
        } else {
          resolve();
        }
      }

      insertRow();
    });
  }).then(function() {
    return knex.schema.table('project', function(table) {
      return table.dropColumns('sponsor_cd', 'sponsor_name');
    });
  });
};

exports.down = function() {
};
