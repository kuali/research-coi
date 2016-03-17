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
export function createDisplayName(hostname, description) {
  return `COI-${hostname}-${description}`;
}

export async function getTemplates(dbInfo, hostname) {
  return [
    {
      'id': '1',
      'applicationId': '1',
      'displayName': 'COI-test.com-Notify COI admin when a new disclosure is submitted by a reporter.',
      'subject': 'submitted',
      'defaults': {
        'email': true,
        'sms': false
      },
      'templates': {
        'email': {
          'text': 'submitted'
        }
      }
    },
    {
      'id': '2',
      'applicationId': '1',
      'displayName': 'COI-test.com-Notify COI admin when an additional reviewer has completed their review',
      'subject': 'completed their review',
      'defaults': {
        'email': true,
        'sms': false
      },
      'templates': {
        'email': {
          'text': 'completed their review'
        }
      }
    }
  ];
}

export async function updateTemplateData(dbInfo, hostname, notificationTemplate) {
  // no-op
}

export async function createNewTemplate(dbInfo, hostname, notificationTemplate) {
  return Math.ceil(Math.random() * 50);
}

