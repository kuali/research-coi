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

/*  eslint-disable
 camelcase,
 no-console,
 no-magic-numbers,
 no-var,
 object-shorthand,
 prefer-template,
 prefer-arrow-callback,
 max-len
 */

exports.up = function(knex) {
  return knex('disclosure_status')
    .update({description: 'Revision Required'})
    .where({status_cd: 4})
    .then(function() {
      return knex('disclosure_status')
        .insert({
          status_cd: 7,
          description: 'Update Needed'
        });
    });
};

exports.down = function() {
};
