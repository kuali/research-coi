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

/*
eslint-disable camelcase
 */

import assert from 'assert';
import * as NotificationService from '../../../../server/services/notification-service/notification-service';

const populatedTemplates = [
  { template_id: 1,
    description: 'Notify COI admin when a new disclosure is submitted by a reporter.',
    type: 'Admin Notifications',
    active: 1,
    subject: 'submitted',
    body: 'submitted',
    index: 0,
    editing: false },
  { template_id: 2,
    description: 'Notify COI admin when an additional reviewer has completed their review',
    type: 'Admin Notifications',
    active: 1,
    core_template_id: '1',
    subject: 'completed their review',
    body: 'completed their review',
    index: 1,
    editing: false
  }
];

const dbTemplates = [
  {
    templateId: 1,
    description: 'Notify COI admin when a new disclosure is submitted by a reporter.',
    type: 'Admin Notifications',
    active: 1
  },
  {
    templateId: 2,
    description: 'Notify COI admin when an additional reviewer has completed their review',
    type: 'Admin Notifications',
    active: 1,
    coreTemplateId: '2'
  },
  {
    templateId: 3,
    description: 'Notify reporter when a new project’s creation requires an annual disclosure update.',
    type: 'Reporter Notifications',
    active: 1
  }
];



describe('NotificationService', () => {
  describe('getDefaults', () => {
    let populatedTemplate;
    before('should populate', () => {
      const template = {
        templateId: 1,
        description: 'submitted',
        type: 'Admin',
        coreTemplateId: null
      };

      populatedTemplate = NotificationService.getDefaults(template);
    });

    it('should populate body', () => {
      assert(populatedTemplate.body !== undefined);
    });

    it('should populate subject', () => {
      assert(populatedTemplate.subject !== undefined);
    });
  });

  describe('handleTemplates', () => {
    let results;

    before(async () => {
      const promises = await NotificationService.handleTemplates('test', 'test.com', populatedTemplates);
      results = await Promise.all(promises);
    });

    it('should assign the new template an Id', () => {
      assert(results[0].core_template_id !== undefined); //eslint-disable-line camelcase
    });

    it('should remove notification service fields', () => {
      assert(results[0].subject === undefined);
      assert(results[0].body === undefined);
      assert(results[0].index === undefined);
      assert(results[0].editing === undefined);
      assert(results[1].subject === undefined);
      assert(results[1].body === undefined);
      assert(results[1].index === undefined);
      assert(results[1].editing === undefined);
    });
  });

  describe('populateTemplateData', () => {
    let results;

    before(async () => {
      const promises = await NotificationService.populateTemplateData('test','test.com', dbTemplates);
      results = await Promise.all(promises);
    });

    it('should find a match based on display name', () => {
      assert.equal('submitted', results[0].body);
      assert.equal('submitted', results[0].subject);
    });

    it('should return defaults if no match', () => {
      assert.equal('completed their review', results[1].body);
      assert.equal('completed their review', results[1].subject);
    });

    it('should return defaults if no match', () => {
      assert.equal('REPLACE WITH DEFAULT', results[2].body);
      assert.equal('REPLACE WITH DEFAULT', results[2].subject);
    });

  });
});
