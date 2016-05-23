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

/* eslint-disable no-magic-numbers, camelcase */

import assert from 'assert';
import * as app from '../../../../server/app';
import request from 'supertest';
import { DISCLOSURE_STATUS, DISCLOSURE_TYPE } from '../../../../coi-constants';
import { ACCEPTED } from '../../../../http-status-codes';
let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

async function insertDisclosure(disclosure, user_id) {
  const id = await knex('disclosure').insert({
    type_cd: disclosure.typeCd,
    status_cd: disclosure.statusCd,
    user_id,
    start_date: disclosure.startDate,
    config_id: disclosure.configId,
    submitted_date: disclosure.submittedDate
  }, 'id');
  return id[0];
}

async function insertProject(project) {
  const id = await knex('project').insert({
    title: project.title,
    type_cd: project.typeCode,
    source_system: project.sourceSystem,
    source_identifier: project.sourceIdentifier,
    source_status: project.sourceStatus,
    sponsor_cd: project.sponsorCode,
    sponsor_name: project.sponsorName,
    start_date: new Date(project.startDate),
    end_date: new Date(project.endDate)
  }, 'id');
  return id[0];
}

async function insertProjectPerson(projectPerson, projectId) {
  const id = await knex('project_person')
    .insert({
      project_id: projectId,
      person_id: projectPerson.personId,
      source_person_type: projectPerson.sourcePersonType,
      role_cd: projectPerson.roleCode,
      active: true
    },'id');
  return id[0];
}

function createProject(sourceIdentifier) {
  return {
    title: 'TEST TITLE',
    typeCode: 1,
    sourceSystem: 'KC-PD',
    sourceIdentifier,
    sourceStatus: 1,
    sponsorCode: '000340',
    sponsorName: 'NIH',
    startDate: '2017-01-01',
    endDate: '2017-1-31'
  };
}

function createPerson(personId, roleCode, active) {
  return {
    personId,
    sourcePersonType: 'EMPLOYEE',
    roleCode,
    active
  };
}

function createDisclosure(statusCd) {
  return {
    typeCd: DISCLOSURE_TYPE.ANNUAL,
    statusCd,
    startDate: new Date(),
    configId: 1,
    submittedDate: new Date()
  };
}

async function testDisclosureStatus(id, expectedStatus) {
  const disclosure = await knex('disclosure')
    .select('status_cd as statusCd','id')
    .where({
      id
    });
  assert.equal(expectedStatus, disclosure[0].statusCd);
}

describe('PUT api/coi/disclosures/:id/approve', async () => {
  before(async () => {
    await knex('project_type')
      .update({req_disclosure: true})
      .where({type_cd: 1});
    await knex('project_role').insert({
      project_type_cd: 1,
      source_role_cd: 'PI',
      req_disclosure: true,
      description: 'Principal Investigator'
    });
    await knex('project_status').insert({
      project_type_cd: 1,
      source_status_cd: 1,
      req_disclosure: true,
      description: 'the status'
    });
  });

  describe('approve - no new projects', async () => {
    const disclosure = createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL);
    let disclosureId;
    before(async function(){
      disclosureId = await insertDisclosure(disclosure, 1);
    });

    it('should return OK status', async () => {
      await request(app.run())
        .put(`/api/coi/disclosures/${disclosureId}/approve`)
        .set('Authorization', `Bearer admin`)
        .send(disclosure)
        .expect(ACCEPTED);
    });

    it('should update status to up to date', async () => {
      await testDisclosureStatus(disclosureId, DISCLOSURE_STATUS.UP_TO_DATE);
    });
  });

  describe('approve - new projects', async () => {
    const disclosure = createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL);
    let disclosureId;
    let projectId;
    before(async function(){
      disclosureId = await insertDisclosure(disclosure, 2);
      projectId = await insertProject(createProject('2'), true);
      await insertProjectPerson(createPerson('2','PI'), projectId);
    });

    it('should return OK status', async () => {
      await request(app.run())
        .put(`/api/coi/disclosures/${disclosureId}/approve`)
        .set('Authorization', `Bearer admin`)
        .send(disclosure)
        .expect(ACCEPTED);
    });

    it('should update status to up to date', async () => {
      await testDisclosureStatus(disclosureId, DISCLOSURE_STATUS.UPDATE_REQUIRED);
    });
  });

  after(async function() {
    await knex('project_type').update({req_disclosure: false});
    await knex('project_role').del();
    await knex('project_status').del();
    await knex('project_person').del();
    await knex('project').del();
    await knex('disclosure_archive').del();
    await knex('disclosure').del();
  });
});
