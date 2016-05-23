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
      active: projectPerson.active
    },'id');
  return id[0];
}

async function insertDispositionType() {
  const id = await knex('disposition_type')
    .insert({
      description: 'test',
      order: 1,
      active: 1
    },'id');
  return id[0];
}

describe('PUT api/coi/project-persons-disposition-types/:id', () => {
  let projectId;
  let projectPersonId;
  let dispositionTypeCd;
  before(async () => {
    projectId = await insertProject(createProject('propdev'));
    projectPersonId = await insertProjectPerson(createPerson('1234','PI',1),projectId);
    dispositionTypeCd = await insertDispositionType();
  });

  describe('update project person', () => {
    it('should return an OK status', async function() {
      await request(app.run())
        .put(`/api/coi/project-persons-disposition-types/${projectPersonId}`)
        .set('Authorization', `Bearer admin`)
        .send({
          dispositionTypeCd
        })
        .expect(OK);
    });

    it('should update the project person', async function() {
      const projectPerson = await knex('project_person').select('*').where({id:projectPersonId});
      assert.equal(dispositionTypeCd,projectPerson[0].disposition_type_cd);
    });
  });

  after(async function() {
    await knex('project_person').del();
    await knex('project').del();
    await knex('disposition_type').del();
  });
});
