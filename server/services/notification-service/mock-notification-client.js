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
 no-unused-vars,

 */

import {
  getAdmins,
  getUserInfosByQuery
} from '../auth-service/mock-auth-client';

export function createDisplayName(hostname, description) {
  return `COI-${hostname}-${description}`;
}

export function getTemplates(dbInfo, hostname) {
  return [
    {
      id: '1',
      applicationId: '1',
      displayName: 'COI-test.com-Notify COI admin when a new disclosure is submitted by a reporter.', // eslint-disable-line max-len
      subject: 'submitted',
      defaults: {
        email: true,
        sms: false
      },
      templates: {
        email: {
          text: 'submitted'
        }
      }
    },
    {
      id: '2',
      applicationId: '1',
      displayName: 'COI-test.com-Notify COI admin when an additional reviewer has completed their review', // eslint-disable-line max-len
      subject: 'completed their review',
      defaults: {
        email: true,
        sms: false
      },
      templates: {
        email: {
          text: 'completed their review'
        }
      }
    }
  ];
}

export async function getUserInfo(dbInfo, hostname, userId) {
  const userInfos = await getUserInfosByQuery(dbInfo, hostname, '1234', userId);
  return userInfos.find(user => user.username === userId);
}

export async function updateTemplateData(
  dbInfo,
  hostname,
  notificationTemplate
) {
  // no-op
}

export function createNewTemplate(
  dbInfo,
  hostname,
  notificationTemplate
) {
  return Math.ceil(Math.random() * 50);
}

export function sendNotification(dbInfo, hostname, notification) {
  return notification;
}

export async function getAdminRecipients(dbInfo, authHeader) {
  const admins = await getAdmins(dbInfo, authHeader);
  return admins.map(admin => admin.email);
}

export function getRecipients(dbInfo, recipients) {
  return [recipients];
}

export function getRequestInfo() {
  return {
    url: 'test.com',
    applicationId: '1234',
    systemAuthToken: '5678'
  };
}

export function areNotificationsEnabled() {
  return true;
}
