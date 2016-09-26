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

export async function getLatestNotifications(knex) {
  return await knex
    .select(
      'id',
      'timestamp',
      'addresses',
      'receipt_ids as receiptIds'
    )
    .from('notification_request')
    .orderBy('id', 'desc')
    .limit(100);
}

export async function notificationTemplateIsForCOI(knex, templateId) {
  const row = await knex
    .first('template_id')
    .from('notification_template')
    .where({
      core_template_id: templateId
    });

  return row !== undefined;
}