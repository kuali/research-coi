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
  return knex.schema.table('disposition_type', function(table) {
    table.string('description_copy', 60);
  }).then(function() {
    return knex.select(
        'type_cd',
        'description'
    ).from('disposition_type');
  }).then(function(existingRows) {
    return new Promise(function(resolve) {
      var i = 0;
      function updateRow() {
        if (i < existingRows.length) {
          knex('disposition_type').where("type_cd", existingRows[i].type_cd).update({'description_copy': existingRows[i].description})
              .then(function() {
                i++;
                updateRow();
              }
          );
        } else {
          resolve();
        }
      }
      updateRow();
    });
  }).then(function() {
        return knex.schema.table('disposition_type', function(table) {
          table.dropColumn('description');
          table.renameColumn('description_copy', 'description');
        })
      });
};

exports.down = function() {
};