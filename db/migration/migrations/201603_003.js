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
  return knex.schema.createTable('notification_template', function(table) {
    table.integer('template_id').notNullable().primary();
    table.string('description', 200).notNullable();
    table.string('type', 200).notNullable();
    table.boolean('active').notNullable().defaultTo(false);
    table.string('core_template_id');
    table.engine('InnoDB');
  }).then(function() {
    return knex('notification_template')
      .insert([
        {
          template_id: 1,
          type: 'Admin Notifications',
          description: 'Notify COI admin when a new disclosure is submitted by a reporter.'
        },
        {
          template_id: 2,
          type: 'Admin Notifications',
          description: 'Notify COI admin when an additional reviewer has completed their review'
        },
        {
          template_id: 3,
          type: 'Reporter Notifications',
          description: 'Notify reporter when a new project’s creation requires an annual disclosure update.'
        },
        {
          template_id: 4,
          type: 'Reporter Notifications',
          description: 'Notify reporter when their disclosure is sent back by an admin for required updates.'
        },
        {
          template_id: 5,
          type: 'Additional Reviewer Notifications',
          description: 'Notify an additional reviewer when they are assigned a disclosure to review.'
        }
      ]);
  });
};

exports.down = function() {
};
