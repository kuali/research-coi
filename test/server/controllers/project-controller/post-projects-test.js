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
import { OK } from '../../../../http-status-codes';
import { DISCLOSURE_STATUS, DISCLOSURE_TYPE } from '../../../../coi-constants';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

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

async function insertProject(project) {
  const id = await knex('project').insert({
    title: project.title,
    type_cd: project.typeCode,
    source_system: project.sourceSystem,
    source_identifier: project.sourceIdentifier,
    source_status: project.sourceStatus,
    sponsor_cd: project.sponsorCode,
    sponsor_name: project.sponsorName,
    start_date: project.startDate,
    end_date: project.endDate
  }, 'id');
  return id[0];
}

async function insertProjectPerson(projectPerson, projectId, isNew) {
  const id = await knex('project_person')
    .insert({
      project_id: projectId,
      person_id: projectPerson.personId,
      source_person_type: projectPerson.sourcePersonType,
      role_cd: projectPerson.roleCode,
      active: projectPerson.active,
      new: isNew
    },'id');
  return id[0];
}

async function post(project) {
  return await request(app.run())
    .post('/api/coi/projects')
    .set('Authorization', `Bearer admin`)
    .send(project)
    .expect(OK);
}

async function testProjectPersons(project_id, isActive, isNew, len, role) {
  const projectPerson = await knex('project_person')
    .select('active', 'new', 'role_cd as roleCd')
    .where({project_id});
  assert.equal(len, projectPerson.length);
  assert.equal(isActive ? 1 : 0, projectPerson[0].active);
  assert.equal(isNew ? 1 : 0, projectPerson[0].new);
  assert.equal(role, projectPerson[0].roleCd);
}

async function testProject(id, title) {
  const project = await knex('project')
    .select('title')
    .where({id});
  assert.equal(title, project[0].title);
}

async function testDisclosureStatus(user_id, expectedStatus) {
  const disclosure = await knex('disclosure')
    .select('status_cd as statusCd','id')
    .where({
      user_id,
      'type_cd': DISCLOSURE_TYPE.ANNUAL
    });
  assert.equal(expectedStatus, disclosure[0].statusCd);
}

async function insertDisclosure(status_cd, user_id) {
  await knex('disclosure').insert({
    type_cd: DISCLOSURE_TYPE.ANNUAL,
    status_cd,
    user_id,
    start_date: new Date(),
    config_id: 1}, 'id');
}

describe('POST api/coi/projects', () => {
  before(async () => {
    await knex('project_type')
      .update({req_disclosure: true})
      .where({type_cd: 1});
    await knex('project_role').insert({
      project_type_cd: 1,
      source_role_cd: 'PI',
      req_disclosure: true,
      description: 'Principal investigator'
    });
    await knex('project_status').insert({
      project_type_cd: 1,
      source_status_cd: 1,
      req_disclosure: true,
      description: 'the status'
    });
  });

  describe('new project no persons', () => {
    let project;
    before(async () => {
      await insertDisclosure(DISCLOSURE_STATUS.UP_TO_DATE, '1');
    });
    it('should return an OK status', async function() {
      const response = await post(createProject(1));
      project = response.body;
    });

    it('should return a project with an id', async function() {
      assert.equal('TEST TITLE', project.title);
      assert(project.id !== undefined);
    });

    it('should insert a new project', async function() {
      await testProject(project.id, 'TEST TITLE');
    });

    it('should not update disclosure status', async function() {
      await testDisclosureStatus('1', DISCLOSURE_STATUS.UP_TO_DATE);
    });
  });

  describe('new project with persons', () => {
    let project;
    before(async () => {
      await insertDisclosure(DISCLOSURE_STATUS.UP_TO_DATE, '2');
    });

    it('should return a OK status', async function() {
      const newProject = createProject(2);
      newProject.persons = [createPerson('2','PI')];
      const response = await post(newProject);
      project = response.body;
    });

    it('should return a project with an id', async function() {
      assert.equal('TEST TITLE', project.title);
      assert.equal(1,project.persons.length);
      assert(project.id !== undefined);
    });

    it('should return a project person with an id', async function() {
      assert.equal('TEST TITLE', project.title);
      assert.equal(1,project.persons.length);
      assert(project.persons[0].id !== undefined);
      assert(project.id !== undefined);
    });

    it('should insert new project record', async function() {
      await testProject(project.id, 'TEST TITLE');
    });

    it('should insert new project person record', async function() {
      await testProjectPersons(project.id, true, true, 1, 'PI');
    });

    it('should update disclosure status', async function() {
      await testDisclosureStatus('2', DISCLOSURE_STATUS.UPDATE_REQUIRED);
    });
  });

  describe('existing project no persons', () => {
    let projectId;
    let project;
    before(async () => {
      project = createProject(3);
      projectId = await insertProject(project);
      await insertDisclosure(DISCLOSURE_STATUS.UP_TO_DATE, '3');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update the project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should not update disclosure status', async function() {
      await testDisclosureStatus('3', DISCLOSURE_STATUS.UP_TO_DATE);
    });
  });

  describe('existing project create person', () => {
    let projectId;
    let project;
    before(async () => {
      project = createProject(4);
      projectId = await insertProject(project);
      await insertDisclosure(DISCLOSURE_STATUS.UP_TO_DATE, '4');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      project.persons = [createPerson('4','PI', true)];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should insert new person record', async function() {
      await testProjectPersons(projectId, true, true, 1, 'PI');
    });

    it('should update disclosure status', async function() {
      await testDisclosureStatus('4', DISCLOSURE_STATUS.UPDATE_REQUIRED);
    });
  });

  describe('existing project update person to non required role ', () => {
    let projectId;
    let project;
    let projectPerson;
    before(async () => {
      project = createProject(5);
      projectId = await insertProject(project);
      projectPerson = createPerson('5','PI', true);
      await insertProjectPerson(projectPerson, projectId, true);
      await insertDisclosure(DISCLOSURE_STATUS.UPDATE_REQUIRED, '5');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      projectPerson.roleCode = 'COI';
      project.persons = [projectPerson];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should update project person record', async function() {
      await testProjectPersons(projectId, true, true, 1, 'COI');
    });

    it('should update disclosure status', async function() {
      await testDisclosureStatus('5', DISCLOSURE_STATUS.UP_TO_DATE);
    });
  });

  describe('existing project deactivate person ', () => {
    let projectId;
    let project;
    let projectPerson;
    before(async () => {
      project = createProject(6);
      projectId = await insertProject(project);
      projectPerson = createPerson('6','PI', true);
      await insertProjectPerson(projectPerson, projectId, true);
      await insertDisclosure(DISCLOSURE_STATUS.UPDATE_REQUIRED, '6');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      project.persons = [];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should update project person active flag to false', async function() {
      await testProjectPersons(projectId, false, true, 1, 'PI');
    });

    it('should update disclosure status', async function() {
      await testDisclosureStatus('6', DISCLOSURE_STATUS.UP_TO_DATE);
    });
  });


  describe('existing project deactivate person other persons still active ', () => {
    let projectId;
    let project;
    let projectPersonId;
    let projectPerson;
    let projectPerson1;
    let projectPersonId1;
    before(async () => {
      project = createProject(7);
      projectId = await insertProject(project);
      projectPerson = createPerson('7','PI', true);
      projectPersonId = await insertProjectPerson(projectPerson, projectId, true);
      projectPerson1 = createPerson('8','PI', true);
      projectPersonId1 = await insertProjectPerson(projectPerson1, projectId, true);
      await insertDisclosure(DISCLOSURE_STATUS.UPDATE_REQUIRED, '7');
      await insertDisclosure(DISCLOSURE_STATUS.UPDATE_REQUIRED, '8');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      project.persons = [projectPerson];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should update removed person to inactive', async function() {
      const dbProjectPerson = await knex('project_person')
        .select('active', 'new', 'role_cd as roleCd')
        .where({id: projectPersonId1});
      assert.equal(false, dbProjectPerson[0].active);
      assert.equal(true, dbProjectPerson[0].new);
    });

    it('should not deactivate existing person', async function() {
      const dbProjectPerson = await knex('project_person')
        .select('active', 'new', 'role_cd as roleCd')
        .where({id: projectPersonId});
      assert.equal(true, dbProjectPerson[0].active);
      assert.equal(true, dbProjectPerson[0].new);
    });

    it('should update disclosure status', async function() {
      await testDisclosureStatus('7', DISCLOSURE_STATUS.UPDATE_REQUIRED);
    });

    it('should not update disclosure status', async function() {
      await testDisclosureStatus('8', DISCLOSURE_STATUS.UP_TO_DATE);
    });
  });

  describe('existing project reactivate person ', () => {
    let projectId;
    let project;
    let projectPerson;
    before(async () => {
      project = createProject(9);
      projectId = await insertProject(project);
      projectPerson = createPerson('9','PI', false);
      await insertProjectPerson(projectPerson, projectId, true);
      await insertDisclosure(DISCLOSURE_STATUS.UP_TO_DATE, '9');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      project.persons = [projectPerson];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should update project person active flag to true', async function() {
      await testProjectPersons(projectId, true, true, 1, 'PI');
    });

    it('should update disclosure status', async function() {
      await testDisclosureStatus('9', DISCLOSURE_STATUS.UPDATE_REQUIRED);
    });
  });

  describe('existing project create person status not up to date', () => {
    let projectId;
    let project;
    before(async () => {
      project = createProject(10);
      projectId = await insertProject(project);
      await insertDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL, '10');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      project.persons = [createPerson('10','PI', true)];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should insert new person record', async function() {
      await testProjectPersons(projectId, true, true, 1, 'PI');
    });

    it('should not update disclosure status', async function() {
      await testDisclosureStatus('10', DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL);
    });
  });

  describe('existing project update on old project ', () => {
    let projectId;
    let project;
    let projectPerson;
    before(async () => {
      project = createProject(11);
      projectId = await insertProject(project);
      projectPerson = createPerson('11','PI', false);
      await insertProjectPerson(projectPerson, projectId, false);
      await insertDisclosure(DISCLOSURE_STATUS.UP_TO_DATE, '11');
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      project.persons = [projectPerson];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should not update disclosure status', async function() {
      await testDisclosureStatus('11', DISCLOSURE_STATUS.UP_TO_DATE);
    });
  });

  after(async function() {
    await knex('project_type').update({req_disclosure: false});
    await knex('project_role').del();
    await knex('project_status').del();
    await knex('project_person').del();
    await knex('project').del();
    await knex('disclosure').del();
  });
});
