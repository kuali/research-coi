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

let getNotificationsInfo;
try {
  const extensions = require('research-extensions').default;
  getNotificationsInfo = extensions.getNotificationsInfo;
} catch (e) {
  getNotificationsInfo = (dbInfo) => { //eslint-disable-line no-unused-vars
    return {
      notificationsUrl: process.env.NOTIFICATIONS_URL || 'https://uit.kuali.dev/res',
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
  return getNotificationsInfo(dbInfo).notificationsMode > NOTIFICATIONS_MODE.OFF;
}

export async function getTemplates(dbInfo, hostname) {
  try {
    const notificationsInfo = getNotificationsInfo(dbInfo);

    const url = notificationsInfo.notificationsUrl || (useSSL ? 'https://' : 'http://') + hostname;
    const response = await request.get(`${url}${END_POINTS.NOTIFICATION_TEMPLATES}`)
      .set('Authorization',`Bearer ${notificationsInfo.systemAuthToken}`);

    return response.body;
  } catch(err) {
    Promise.reject(err);
  }
}

export function createDisplayName(hostname, description) {
  return `COI-${hostname}-${description}`;
}

export function getRequestInfo(dbInfo, hostname) {
  const notificationsInfo = getNotificationsInfo(dbInfo);
  return {
    url: notificationsInfo.notificationsUrl || (useSSL ? 'https://' : 'http://') + hostname,
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
        text: notificationTemplate.body
      }
    }
  };
}

export async function updateTemplateData(dbInfo, hostname, notificationTemplate) {
  try {

    const requestInfo = getRequestInfo(dbInfo, hostname);
    const template = createCoreTemplate(notificationTemplate, hostname, requestInfo.applicationId);
    await request.put(`${requestInfo.url}${END_POINTS.NOTIFICATION_TEMPLATES}/${notificationTemplate.core_template_id}`)
      .set('Authorization', `Bearer ${requestInfo.systemAuthToken}`)
      .send(template);

    return Promise.resolve();
  } catch(err) {
    return Promise.reject(err);
  }
}

export async function createNewTemplate(dbInfo, hostname, notificationTemplate) {
  try {
    const requestInfo = getRequestInfo(dbInfo, hostname);
    const coreTemplate = createCoreTemplate(notificationTemplate, hostname, requestInfo.applicationId);
    const response = await request.post(`${requestInfo.url}${END_POINTS.NOTIFICATION_TEMPLATES}`)
      .set('Authorization', `Bearer ${requestInfo.systemAuthToken}`)
      .send(coreTemplate);

    return response.body.id;

  } catch(err) {
    Promise.reject(err);
  }
}

export async function getUserInfo(dbInfo, hostname, userId) {
  const notificationsInfo = getNotificationsInfo(dbInfo);
  const userInfos = await getUserInfosByQuery(dbInfo, hostname, notificationsInfo.systemAuthToken, userId);
  //user info query can bring back multiple results we want the one that has the userId
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
  try {
    const requestInfo = getRequestInfo(dbInfo, hostname);

    await request.post(`${requestInfo.url}${END_POINTS.NOTIFICATIONS}`)
      .set('Authorization', `Bearer ${requestInfo.systemAuthToken}`)
      .send(notification);

  } catch (err) {
    Promise.reject(err);
  }


}
