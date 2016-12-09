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

import request from 'superagent';
import { getUserInfosByQuery, getAdmins } from '../auth-service/auth-service';
import { NOTIFICATIONS_MODE } from '../../../coi-constants';
import {OK} from '../../../http-status-codes';
import getKnex from '../../db/connection-manager';
import {createLogger} from '../../log';
const log = createLogger('NotificationClient');

let getNotificationsInfo;
try {
  const extensions = require('research-extensions').default;
  getNotificationsInfo = extensions.getNotificationsInfo;
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    log.error(e);
  }
  getNotificationsInfo = (dbInfo) => { //eslint-disable-line no-unused-vars
    return {
      notificationsUrl: (
        process.env.NOTIFICATIONS_URL ||
        'https://uit.kuali.dev/res'
      ),
      applicationId: process.env.APPLICATION_ID,
      systemAuthToken: process.env.SYSTEM_AUTH_TOKEN,
      notificationsMode: process.env.NOTIFICATION_MODE,
      testEmail: process.env.TEST_EMAIL
    };
  };
}

const useSSL = process.env.AUTH_OVER_SSL !== 'false';

const END_POINTS = {
  NOTIFICATION_TEMPLATES: '/api/v1/notification-templates',
  NOTIFICATIONS: '/api/v1/notifications'
};

export function areNotificationsEnabled(dbInfo) {
  return (
    getNotificationsInfo(dbInfo).notificationsMode > NOTIFICATIONS_MODE.OFF
  );
}

export function getRecipients(dbInfo, recipients) {
  const notificationsInfo = getNotificationsInfo(dbInfo);
  if (notificationsInfo.notificationsMode > NOTIFICATIONS_MODE.TEST) {
    return [recipients];
  }

  return [notificationsInfo.testEmail];
}

export async function getTemplates(dbInfo, hostname) {
  const notificationsInfo = getNotificationsInfo(dbInfo);
  const url = (
    notificationsInfo.notificationsUrl ||
    (useSSL ? 'https://' : 'http://') + hostname
  );
  const response = await request
    .get(`${url}${END_POINTS.NOTIFICATION_TEMPLATES}`)
    .set('Authorization',`Bearer ${notificationsInfo.systemAuthToken}`);

  return response.body;
}

export function createDisplayName(hostname, description) {
  return `COI-${hostname}-${description}`;
}

export function getRequestInfo(dbInfo, hostname) {
  const notificationsInfo = getNotificationsInfo(dbInfo);
  return {
    url: (
      notificationsInfo.notificationsUrl ||
      (useSSL ? 'https://' : 'http://') + hostname
    ),
    applicationId: notificationsInfo.applicationId,
    systemAuthToken: notificationsInfo.systemAuthToken
  };
}

function createCoreTemplate(notificationTemplate, hostname, applicationId) {
  return {
    applicationId,
    displayName: createDisplayName(hostname, notificationTemplate.description),
    subject: notificationTemplate.subject,
    defaults: {
      email: true,
      sms: false
    },
    templates: {
      email: {
        text: notificationTemplate.body,
        html: notificationTemplate.body
      }
    }
  };
}

export async function updateTemplateData(
  dbInfo,
  hostname,
  notificationTemplate
) {
  const requestInfo = getRequestInfo(dbInfo, hostname);
  const template = createCoreTemplate(
    notificationTemplate,
    hostname,
    requestInfo.applicationId
  );
  await request
    .put(`${requestInfo.url}${END_POINTS.NOTIFICATION_TEMPLATES}/${notificationTemplate.core_template_id}`) // eslint-disable-line max-len
    .set('Authorization', `Bearer ${requestInfo.systemAuthToken}`)
    .send(template);
}

export async function createNewTemplate(
  dbInfo,
  hostname,
  notificationTemplate
) {
  const requestInfo = getRequestInfo(dbInfo, hostname);
  const coreTemplate = createCoreTemplate(
    notificationTemplate,
    hostname,
    requestInfo.applicationId
  );
  const response = await request
    .post(`${requestInfo.url}${END_POINTS.NOTIFICATION_TEMPLATES}`)
    .set('Authorization', `Bearer ${requestInfo.systemAuthToken}`)
    .send(coreTemplate);

  return response.body.id;
}

export async function getUserInfo(dbInfo, hostname, userId) {
  const notificationsInfo = getNotificationsInfo(dbInfo);
  const userInfos = await getUserInfosByQuery(
    dbInfo,
    hostname,
    notificationsInfo.systemAuthToken,
    userId
  );

  if (!Array.isArray(userInfos) || userInfos.length === 0) {
    throw Error(`NotificationClient.getUserInfo: User id ${userId} not found`);
  }
  // user info query can bring back multiple results
  // we want the one that has the userId
  return userInfos.find(user => user.schoolId === userId);
}

export async function getAdminRecipients(dbInfo, authHeader) {
  const notificationsInfo = getNotificationsInfo(dbInfo);
  if (notificationsInfo.notificationsMode > NOTIFICATIONS_MODE.TEST) {
    const admins = await getAdmins(dbInfo, authHeader);
    return admins.map(admin => admin.email);
  }
  return [notificationsInfo.testEmail];
}

export async function sendNotification(dbInfo, hostname, notification) {
  const requestInfo = getRequestInfo(dbInfo, hostname);

  log.info('Requesting notification be sent:');
  log.info(JSON.stringify(notification));
  let response;
  try {
    response = await request
      .post(`${requestInfo.url}${END_POINTS.NOTIFICATIONS}`)
      .set('Authorization', `Bearer ${requestInfo.systemAuthToken}`)
      .send(notification);
  } catch (err) {
    log.error('Notification request failed');
    log.error(err);
  }

  if (!response || response.status !== OK) {
    log.error('Notification may not have been sent successfully');
    log.error(JSON.stringify(notification));
    if (response) {
      log.error(JSON.stringify(response.status));
    }
  }
  else {
    log.info('Notification requested successfully');
    log.info(JSON.stringify(response.body));

    const receiptIds = response.body.map(receipt => receipt.notificationId);
    log.logValue('receiptIds', receiptIds);
    await recordNotificationRequest(
      getKnex(dbInfo),
      JSON.stringify(notification.addresses),
      receiptIds
    );
    log.verbose('done recording receipts');

    setTimeout(async () => {
      checkStatuses(dbInfo, hostname, receiptIds);
    }, 90000);
  }
}

async function checkStatuses(dbInfo, hostname, receiptIds) {
  for (const receiptId of receiptIds) {
    const detail = await getNotificationReceiptDetail(
      dbInfo,
      hostname,
      receiptId
    );

    if (detail.status === 'FAILED') {
      log.error(
        `Notification to ${detail.address} failed. ID: ${detail.id}`
      );
    }
    else if (detail.status === 'PENDING') {
      log.error(`Notification to ${detail.address} still pending after 90 seconds. ID: ${detail.id}`); // eslint-disable-line max-len
    }
  }
}

async function recordNotificationRequest(knex, addresses, receiptIds) {
  log.logArguments('recordNotificationRequest', {addresses, receiptIds});
  await knex('notification_request')
    .insert({
      timestamp: new Date(),
      addresses,
      receipt_ids: JSON.stringify(receiptIds) // eslint-disable-line camelcase
    });
}

export async function getNotificationReceiptDetail(dbInfo, hostname, id) {
  const requestInfo = getRequestInfo(dbInfo, hostname);

  let response;
  try {
    response = await request
      .get(`${requestInfo.url}${END_POINTS.NOTIFICATIONS}/${id}`)
      .set('Authorization', `Bearer ${requestInfo.systemAuthToken}`);
  } catch (err) {
    log.error('Notification detail request failed');
    log.error(err);
  }

  if (response && response.status === OK) {
    return response.body;
  }
}
