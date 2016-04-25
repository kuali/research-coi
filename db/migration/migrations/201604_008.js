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
  return knex.schema.table('project', function(table) {
    table.string('title_new', 2000);
  })
    .then(function() {
      return knex('project').select('id','title').then(function(projects) {
        return Promise.all(projects.map(function(project) {
          return knex('project').update({title_new: project.title}).where({id: project.id});
        }));
      });
    })
    .then(function() {
      return knex.schema.table('project', function(table) {
        table.renameColumn('title', 'title_old');
      })
        .table('project', function(table) {
          table.renameColumn('title_new', 'title');
        })
        .table('project', function(table) {
          table.dropColumn('title_old');
        });
    });
};

exports.down = function() {
};
