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

import { ROLES } from '../../coi-constants';
const { ADMIN } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import useKnex from '../middleware/request-knex';
import NotificationsDB from '../db/notifications-db';
import {FORBIDDEN, NOT_FOUND} from '../../http-status-codes';
import {
  getNotificationReceiptDetail
} from '../services/notification-service/notification-service';

export const init = app => {
  app.get(
    '/api/coi/notifications',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({knex}, res) => {
      const notificationRequests = await NotificationsDB.getLatestNotifications(
        knex
      );
      res.send(notificationRequests);
    })
  );

  app.get(
    '/api/coi/notifications/:id',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({dbInfo, knex, params, hostname}, res) =>
    {
      const detail = await getNotificationReceiptDetail(
        dbInfo,
        hostname,
        params.id
      );
      if (!detail) {
        res.sendStatus(NOT_FOUND);
        return;
      }

      const valid = await NotificationsDB.notificationTemplateIsForCOI(
        knex,
        detail.templateId
      );
      if (!valid) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      res.send(detail);
    }
  ));
};
