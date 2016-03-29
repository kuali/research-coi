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
import { COIConstants } from '../../../../coi-constants';
import { formatDate } from '../../../../server/date-utils';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

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

  describe('createAndSendSubmitNotification', () => {
    let results;
    let disclosureId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 1});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1}, 'id');

      disclosureId = dislcosureIds[0];
      results = await NotificationService.createAndSendSubmitNotification({},'test.com','Bearer 1234', {id: '5678'}, disclosureId);
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('5678', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(2, results.addresses.length);
      assert.equal('admin1@email.com', results.addresses[0]);
      assert.equal('admin2@email.com', results.addresses[1]);
    });

    it('should populate the variables', () => {
      assert.equal( 'test.com/coi/admin',results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal( 'test.com/coi',results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal( 'User',results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal( '1234',results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal( formatDate(now),results.variables['{{NOW}}']);
      assert.equal( formatDate(now),results.variables['{{SUBMISSION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{EXPIRATION_DATE}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});

      await knex('disclosure').del();
    });
  });

  describe('createAndSendApproveNotification', () => {
    let results;
    let disclosureId;
    let archiveId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 6});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1}, 'id');

      disclosureId = dislcosureIds[0];

      const disclosure = JSON.stringify({
        typeCd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        statusCd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        userId: '1234',
        startDate: now,
        expiredDate: now,
        submittedDate: now,
        configId: 1
      });

      const archiveIds = await knex('disclosure_archive').insert({
        disclosure_id: disclosureId,
        approved_by: 'Admin, COI',
        approved_date: now,
        disclosure
      }, 'id');

      archiveId = archiveIds[0];

      results = await NotificationService.createAndSendApproveNotification({},'test.com', {id: '5678'}, archiveId);
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('5678', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(1, results.addresses.length);
      assert.equal('1234@email.com', results.addresses[0]);
    });

    it('should populate the variables', () => {
      assert.equal( 'test.com/coi/admin',results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal( 'test.com/coi',results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal( 'User',results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal( '1234',results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal( 'COI',results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal( 'Admin',results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal( formatDate(now),results.variables['{{NOW}}']);
      assert.equal( formatDate(now),results.variables['{{SUBMISSION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{EXPIRATION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{APPROVAL_DATE}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});
      await knex('disclosure_archive').del();
      await knex('disclosure').del();
    });

  });

  describe('createAndSendExpireNotification', () => {
    let results;
    let disclosureId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 7});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1}, 'id');

      disclosureId = dislcosureIds[0];
      results = await NotificationService.createAndSendExpireNotification({},'test.com', disclosureId);
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('1509442', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(1, results.addresses.length);
      assert.equal('1234@email.com', results.addresses[0]);
    });

    it('should populate the variables', () => {
      assert.equal( 'test.com/coi/admin',results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal( 'test.com/coi',results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal( 'User',results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal( '1234',results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal( formatDate(now),results.variables['{{NOW}}']);
      assert.equal( formatDate(now),results.variables['{{SUBMISSION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{EXPIRATION_DATE}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});

      await knex('disclosure').del();
    });
  });

  describe('createAndSendExpireNotification', () => {
    let results;
    let disclosureId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 4});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1}, 'id');

      disclosureId = dislcosureIds[0];
      results = await NotificationService.createAndSendSentBackNotification({},'test.com',{id: '5678'}, disclosureId);
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('5678', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(1, results.addresses.length);
      assert.equal('1234@email.com', results.addresses[0]);
    });

    it('should populate the variables', () => {
      assert.equal( 'test.com/coi/admin',results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal( 'test.com/coi',results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal( 'User',results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal( '1234',results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal( formatDate(now),results.variables['{{NOW}}']);
      assert.equal( formatDate(now),results.variables['{{SUBMISSION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{EXPIRATION_DATE}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});

      await knex('disclosure').del();
    });
  });

  describe('createAndSendReviewerAssignedNotification', () => {
    let results;
    let disclosureId;
    let reviewerId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 5});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1}, 'id');

      disclosureId = dislcosureIds[0];

      const dates = JSON.stringify([
        {
          type: COIConstants.DATE_TYPE.ASSIGNED,
          date: now
        }
      ]);
      const reviewerIds = await knex('additional_reviewer').insert({
        user_id: 1,
        disclosure_id: disclosureId,
        name: 'tester',
        email: 'tester@email.com',
        active: true,
        dates,
        assigned_by: 'Admin, COI'
      });

      reviewerId = reviewerIds[0];


      results = await NotificationService.createAndSendReviewerAssignedNotification({},'test.com', {id: '5678'}, reviewerId);
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('5678', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(1, results.addresses.length);
      assert.equal('tester@email.com', results.addresses[0]);
    });

    it('should populate the variables', () => {
      assert.equal( 'test.com/coi/admin',results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal( 'test.com/coi',results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal( 'User',results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal( '1234',results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal( formatDate(now),results.variables['{{NOW}}']);
      assert.equal( formatDate(now),results.variables['{{SUBMISSION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{EXPIRATION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{REVIEW_ASSIGNED}}']);
      assert.equal( '',results.variables['{{REVIEW_COMPLETED}}']);
      assert.equal( 'COI',results.variables['{{ASSIGNER_FIRST_NAME}}']);
      assert.equal( 'Admin',results.variables['{{ASSIGNER_LAST_NAME}}']);
      assert.equal( 'User',results.variables['{{REVIEWER_FIRST_NAME}}']);
      assert.equal( '1',results.variables['{{REVIEWER_LAST_NAME}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});

      await knex('additional_reviewer').del();
      await knex('disclosure').del();
    });
  });

  describe('createAndSendReviewerUnassignNotification', () => {
    let results;
    let disclosureId;
    let reviewerId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 8});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1}, 'id');

      disclosureId = dislcosureIds[0];

      const dates = JSON.stringify([
        {
          type: COIConstants.DATE_TYPE.ASSIGNED,
          date: now
        }
      ]);
      const reviewerIds = await knex('additional_reviewer').insert({
        user_id: 1,
        disclosure_id: disclosureId,
        name: 'tester',
        email: 'tester@email.com',
        active: true,
        dates,
        assigned_by: 'Admin, COI'
      });

      reviewerId = reviewerIds[0];


      results = await NotificationService.createAndSendReviewerUnassignNotification({},'test.com', {id: '5678'}, reviewerId);
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('5678', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(1, results.addresses.length);
      assert.equal('tester@email.com', results.addresses[0]);
    });

    it('should populate the variables', () => {
      assert.equal( 'test.com/coi/admin',results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal( 'test.com/coi',results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal( 'User',results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal( '1234',results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal( formatDate(now),results.variables['{{NOW}}']);
      assert.equal( formatDate(now),results.variables['{{SUBMISSION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{EXPIRATION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{REVIEW_ASSIGNED}}']);
      assert.equal( '',results.variables['{{REVIEW_COMPLETED}}']);
      assert.equal( 'COI',results.variables['{{ASSIGNER_FIRST_NAME}}']);
      assert.equal( 'Admin',results.variables['{{ASSIGNER_LAST_NAME}}']);
      assert.equal( 'User',results.variables['{{REVIEWER_FIRST_NAME}}']);
      assert.equal( '1',results.variables['{{REVIEWER_LAST_NAME}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});

      await knex('additional_reviewer').del();
      await knex('disclosure').del();
    });
  });

  describe('createAndSendReviewCompleteNotification', () => {
    let results;
    let disclosureId;
    let reviewerId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 2});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1}, 'id');

      disclosureId = dislcosureIds[0];

      const dates = JSON.stringify([
        {
          type: COIConstants.DATE_TYPE.ASSIGNED,
          date: now
        },
        {
          type: COIConstants.DATE_TYPE.COMPLETED,
          date: now
        }
      ]);
      const reviewerIds = await knex('additional_reviewer').insert({
        user_id: 1,
        disclosure_id: disclosureId,
        name: 'tester',
        email: 'tester@email.com',
        active: true,
        dates,
        assigned_by: 'Admin, COI'
      });

      reviewerId = reviewerIds[0];


      results = await NotificationService.createAndSendReviewCompleteNotification({},'test.com', 'Bearer 1234', {id: '5678'}, reviewerId);
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('5678', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(2, results.addresses.length);
      assert.equal('admin1@email.com', results.addresses[0]);
      assert.equal('admin2@email.com', results.addresses[1]);
    });

    it('should populate the variables', () => {
      assert.equal( 'test.com/coi/admin',results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal( 'test.com/coi',results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal( 'User',results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal( '1234',results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal( undefined, results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal( formatDate(now),results.variables['{{NOW}}']);
      assert.equal( formatDate(now),results.variables['{{SUBMISSION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{EXPIRATION_DATE}}']);
      assert.equal( formatDate(now),results.variables['{{REVIEW_ASSIGNED}}']);
      assert.equal( formatDate(now),results.variables['{{REVIEW_COMPLETED}}']);
      assert.equal( 'COI',results.variables['{{ASSIGNER_FIRST_NAME}}']);
      assert.equal( 'Admin',results.variables['{{ASSIGNER_LAST_NAME}}']);
      assert.equal( 'User',results.variables['{{REVIEWER_FIRST_NAME}}']);
      assert.equal( '1',results.variables['{{REVIEWER_LAST_NAME}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});

      await knex('additional_reviewer').del();
      await knex('disclosure').del();
    });
  });

  describe('createAndSendNewProjectNotification', () => {
    let results;
    let disclosureId;
    const now = new Date();

    before(async () => {
      await knex('notification_template')
        .update({
          core_template_id: '1234',
          active: 1
        })
        .where({template_id: 3});

      const dislcosureIds = await knex('disclosure').insert({
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
        user_id: '1234',
        start_date: now,
        expired_date: now,
        submitted_date: now,
        config_id: 1
      }, 'id');

      disclosureId = dislcosureIds[0];

      const person = {
        'sourceSystem':'KC-PD',
        'sourceIdentifier':'1239',
        'personId':'1234',
        'sourcePersonType':'EMPLOYEE',
        'roleCode':'PI'
      };
      
      const project = {
        'title':'TEST',
        'typeCode':1,
        'sourceSystem':'KC-PD',
        'sourceIdentifier':'1239',
        'sourceStatus':'1',
        'persons':[
          {
            'sourceSystem':'KC-PD',
            'sourceIdentifier':'1239',
            'personId':'PI',
            'sourcePersonType':'EMPLOYEE',
            'roleCode':'PI'}
        ],
        'sponsorCode':'000340',
        'sponsorName':'NIH',
        'startDate':'2016-07-01',
        'endDate':'2018-06-30'
      };

      results = await NotificationService.createAndSendNewProjectNotification({}, 'test.com', {id: '5678'}, disclosureId, project, person );
    });

    it('should pull the correct core template id from the db', () => {
      assert.equal('1234', results.templateId);
    });

    it('should get the creator id from the request', () => {
      assert.equal('1509442', results.creatorId);
    });

    it('should get the correct recipients', () => {
      assert.equal(1, results.addresses.length);
      assert.equal('1234@email.com', results.addresses[0]);
    });

    it('should populate the variables', () => {
      assert.equal('test.com/coi/admin', results.variables['{{ADMIN_DASHBOARD}}']);
      assert.equal('test.com/coi', results.variables['{{REPORTER_DASHBOARD}}']);
      assert.equal('User', results.variables['{{REPORTER_FIRST_NAME}}']);
      assert.equal('1234', results.variables['{{REPORTER_LAST_NAME}}']);
      assert.equal(undefined, results.variables['{{APPROVER_FIRST_NAME}}']);
      assert.equal(undefined, results.variables['{{APPROVER_LAST_NAME}}']);
      assert.equal(formatDate(now), results.variables['{{NOW}}']);
      assert.equal(formatDate(now), results.variables['{{SUBMISSION_DATE}}']);
      assert.equal(formatDate(now), results.variables['{{EXPIRATION_DATE}}']);
      assert.equal(undefined, results.variables['{{REVIEW_ASSIGNED}}']);
      assert.equal(undefined, results.variables['{{REVIEW_COMPLETED}}']);
      assert.equal(undefined, results.variables['{{ASSIGNER_FIRST_NAME}}']);
      assert.equal(undefined, results.variables['{{ASSIGNER_LAST_NAME}}']);
      assert.equal(undefined, results.variables['{{REVIEWER_FIRST_NAME}}']);
      assert.equal(undefined, results.variables['{{REVIEWER_LAST_NAME}}']);
      assert.equal('User', results.variables['{{PI_FIRST_NAME}}']);
      assert.equal('PI', results.variables['{{PI_LAST_NAME}}']);
      assert.equal('TEST', results.variables['{{PROJECT_TITLE}}']);
      assert.equal('Proposal', results.variables['{{PROJECT_TYPE}}']);
      assert.equal('NIH', results.variables['{{PROJECT_SPONSOR}}']);
      assert.equal('1239', results.variables['{{PROJECT_NUMBER}}']);
      assert.equal('User', results.variables['{{PROJECT_PERSON_FIRST_NAME}}']);
      assert.equal('1234', results.variables['{{PROJECT_PERSON_LAST_NAME}}']);
    });

    after(async () => {
      await knex('notification_template')
        .update({
          core_template_id: null,
          active: 0
        })
        .where({template_id: 1});

      await knex('additional_reviewer').del();
      await knex('disclosure').del();
    });
  });
});
