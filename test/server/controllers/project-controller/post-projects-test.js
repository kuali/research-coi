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
    endDate: '2017-21-31'
  };
}

function createPerson(personId, roleCode) {
  return {
    personId,
    sourcePersonType: 'EMPLOYEE',
    roleCode
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

async function insertProjectPerson(projectPerson, projectId) {
  const id = await knex('project_person')
    .insert({
      project_id: projectId,
      person_id: projectPerson.personId,
      source_person_type: projectPerson.sourcePersonType,
      role_cd: projectPerson.roleCode
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

describe('POST api/coi/projects', () => {
  describe('new project no persons', () => {
    let project;
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
  });

  describe('new project with persons', () => {
    let project;
    it('should return a OK status', async function() {
      const newProject = createProject(2);
      newProject.persons = [createPerson('1234','PI')];
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
  });

  describe('existing project no persons', () => {
    let projectId;
    let project;
    before(async () => {
      project = createProject(3);
      projectId = await insertProject(project);
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update the project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });
  });

  describe('existing project create person', () => {
    let projectId;
    let project;
    before(async () => {
      project = createProject(4);
      projectId = await insertProject(project);
    });

    it('should return an OK status with no content', async function() {
      project.title = 'Panda Dogs';
      project.persons = [createPerson('1234','PI')];
      const response = await post(project);
      assert.deepEqual({},response.body);
    });

    it('should update project record', async function() {
      await testProject(projectId, 'Panda Dogs');
    });

    it('should insert new person record', async function() {
      await testProjectPersons(projectId, true, true, 1, 'PI');
    });
  });

  describe('existing project update person ', () => {
    let projectId;
    let project;
    let projectPerson;
    before(async () => {
      project = createProject(5);
      projectId = await insertProject(project);
      projectPerson = createPerson('1234','PI');
      await insertProjectPerson(projectPerson, projectId);
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
  });

  describe('existing project deactivate person ', () => {
    let projectId;
    let project;
    let projectPerson;
    before(async () => {
      project = createProject(6);
      projectId = await insertProject(project);
      projectPerson = createPerson('1234','PI');
      await insertProjectPerson(projectPerson, projectId);
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
      projectPerson = createPerson('1234','PI');
      projectPersonId = await insertProjectPerson(projectPerson, projectId);
      projectPerson1 = createPerson('5678','PI');
      projectPersonId1 = await insertProjectPerson(projectPerson1, projectId);
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
  });

  after(async function() {
    await knex('project_person').del();
    await knex('project').del();
  });
});
