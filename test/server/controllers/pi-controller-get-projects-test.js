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

import assert from 'assert';
import * as app from '../../../server/app';
import request from 'supertest';
import hashCode from '../../../hash';
import { OK } from '../../../http-status-codes';
import getKnex from '../../../server/db/connection-manager';

const knex = getKnex({});

function updateProjectTypes() {
  return knex('project_type')
    .update({
      req_disclosure: true
    })
    .where({type_cd: 1});
}

function insertProjectRoles(projectTypeCd) {
  return knex('project_role').insert([
    {
      project_type_cd: projectTypeCd,
      source_role_cd: 'PI',
      description: 'Principle Investigator',
      req_disclosure: true,
      active: true
    },
    {
      project_type_cd: projectTypeCd,
      source_role_cd: 'COI',
      description: 'Co-Investigator',
      req_disclosure: true,
      active: true
    },
    {
      project_type_cd: projectTypeCd,
      source_role_cd: 'KP',
      description: 'Key Person',
      req_disclosure: false,
      active: true
    }
  ]);
}

function insertProjectStatuses(projectTypeCd) {
  return knex('project_status').insert([
    {
      project_type_cd: projectTypeCd,
      source_status_cd: '1',
      description: 'In Progress',
      req_disclosure: true,
      active: true
    },
    {
      project_type_cd: projectTypeCd,
      source_status_cd: '2',
      description: 'Approval Pending',
      req_disclosure: true,
      active: true
    },
    {
      project_type_cd: projectTypeCd,
      source_status_cd: '10 ',
      description: 'Cancelled',
      req_disclosure: false,
      active: true
    }
  ]);
}

async function insertProject(project) {
  const insertedProject = await knex('project').insert({
    title: project.title,
    type_cd: project.type_cd,
    source_system: project.source_system,
    source_identifier: project.source_identifier,
    source_status: project.source_status
  }, 'id');

  await knex('project_sponsor').insert({
    project_id: insertedProject[0],
    sponsor_cd: project.sponsor_cd,
    source_identifier: project.source_identifier,
    source_system: project.source_system,
    sponsor_name: ''
  });

  await knex('project_person').insert({
    project_id: insertedProject[0],
    person_id: project.person_id,
    source_person_type: project.source_person_type,
    role_cd: project.role_cd,
    active: project.active
  });
}

async function insertProjectsAndPersons(user) {
  const userHash = hashCode(user);

  await insertProject({
    title: 'test project1',
    type_cd: 1,
    source_system: 'propdev',
    source_identifier: 1,
    source_status: '1',
    sponsor_cd: '000340',
    person_id: userHash,
    source_person_type: 'employee',
    role_cd: 'PI',
    active: true
  });

  await insertProject({
    title: 'test project2',
    type_cd: 1,
    source_system: 'propdev',
    source_identifier: 2,
    source_status: '2',
    sponsor_cd: '000500',
    person_id: userHash,
    source_person_type: 'employee',
    role_cd: 'COI',
    active: true
  });

  await insertProject({
    title: 'test project3',
    type_cd: 1,
    source_system: 'propdev',
    source_identifier: 3,
    source_status: '10',
    sponsor_cd: '000500',
    person_id: userHash,
    source_person_type: 'employee',
    role_cd: 'PI',
    active: true
  });

  await insertProject({
    title: 'test project4',
    type_cd: 1,
    source_system: 'propdev',
    source_identifier: 4,
    source_status: '10',
    sponsor_cd: '000500',
    person_id: userHash,
    source_person_type: 'employee',
    role_cd: 'KP',
    active: true
  });

  await insertProject({
    title: 'test project5',
    type_cd: 1,
    source_system: 'propdev',
    source_identifier: 5,
    source_status: '1',
    sponsor_cd: '000500',
    person_id: userHash,
    source_person_type: 'employee',
    role_cd: 'KP',
    active: true
  });

  await insertProject({
    title: 'test project6',
    type_cd: 1,
    source_system: 'irb',
    source_identifier: 1,
    source_status: '1',
    sponsor_cd: '000500',
    person_id: userHash,
    source_person_type: 'employee',
    role_cd: 'PI',
    active: true
  });
}

describe('ProjectControllerTest', async () => {
  const user = 'projectTest';
  before(async function() {
    await updateProjectTypes([1]);
    await insertProjectRoles(1);
    await insertProjectStatuses(1);
    await insertProjectsAndPersons(user);
  });

  describe('/api/coi/projects', () => {
    it('get projects with out filter returns all projects', async function () {
      const response = await request(app.run())
        .get('/api/coi/projects')
        .set('Authorization',`Bearer ${user}`)
        .expect(OK);

      const projects = response.body;
      assert.equal(6, projects.length);
    });
  });

  after(async function() {
    await knex('project_type').update({req_disclosure: false});
    await knex('project_role').del();
    await knex('project_status').del();
    await knex('project_person').del();
    await knex('project_sponsor').del();
    await knex('project').del();
  });
});