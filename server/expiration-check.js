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

/* eslint-disable camelcase */

import {DISCLOSURE_STATUS} from '../coi-constants';
import moment from 'moment';
import {
  createAndSendExpirationNotification,
  createAndSendExpirationReminderNotification
} from './services/notification-service/notification-service';
import getKnex from './db/connection-manager';
import {createLogger} from './log';
const log = createLogger('ExpirationCheck');

const MILLIS_IN_A_DAY = 86400000;
const REMINDER_TEMPLATE_ID = 9;

async function checkForExpiredDisclosures(expiredCode) {
  try {
    log.info('Checking for disclosures which have expired');
    const knex = getKnex();

    const reminderNotification = await knex('notification_template')
      .select('value', 'period')
      .where({template_id: REMINDER_TEMPLATE_ID});

    const remindersDisclosures = await knex('disclosure')
      .select('id')
      .where(
        'expired_date',
        '=',
        new Date(
          moment()
            .add(
              reminderNotification[0].value,
              reminderNotification[0].period
            )
            .format('YYYY-MM-DD')
        )
      );

    const expiredDisclosures = await knex('disclosure')
      .select('id')
      .whereNot('status_cd', expiredCode)
      .andWhere('expired_date', '<', new Date());

    const numberExpired = await knex('disclosure')
      .whereNot('status_cd', expiredCode)
      .andWhere('expired_date', '<', new Date())
      .update({
        status_cd: expiredCode
      });

    console.log(`${numberExpired} disclosures expired`); // eslint-disable-line no-console

    return {
      expirationNotifications: expiredDisclosures.map(disclosure => {
        return {
          dbInfo: {},
          hostname: process.env.HOST_NAME,
          disclosureId: disclosure.id
        };
      }),
      expirationReminders: remindersDisclosures.map(disclosure => {
        return {
          dbInfo: {},
          hostname: process.env.HOST_NAME,
          disclosureId: disclosure.id
        };
      })
    };
  }
  catch (err) {
    log.error(err);
  }
}

let expirationCheck;
try {
  const extensions = require('research-extensions').default;
  expirationCheck = extensions.expirationCheck;
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    log.error(err);
  }
  expirationCheck = checkForExpiredDisclosures;
}

export async function handleNotifications() {
  const notifications = await expirationCheck(DISCLOSURE_STATUS.EXPIRED);
  await notifications.expirationNotifications.map(async (disclosure) => {
    try {
      return await createAndSendExpirationNotification(
        disclosure.dbInfo,
        disclosure.hostname,
        disclosure.disclosureId
      );
    } catch (err) {
      log.error(err);
      return Promise.resolve();
    }
  });

  await notifications.expirationReminders.map(async (disclosure) => {
    try {
      return await createAndSendExpirationReminderNotification(
        disclosure.dbInfo,
        disclosure.hostname,
        disclosure.disclosureId
      );
    } catch (err) {
      log.error(err);
      return Promise.resolve();
    }
  });
}

export default function scheduleExpirationCheck() {
  const waitUntilToRun = Math.random() * MILLIS_IN_A_DAY;
  setTimeout(async () => {
    log.info(
      'Scheduled the expired disclosures check to run every 24 hours from now'
    );
    handleNotifications();
    setInterval(async () => {
      handleNotifications();
    }, MILLIS_IN_A_DAY);
  }, waitUntilToRun);
}
