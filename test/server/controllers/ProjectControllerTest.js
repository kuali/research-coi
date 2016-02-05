/*
 The Conflict of Interest (COI) module of Kuali Research
 Copyright © 2015 Kuali, Inc.

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

/*global describe, it, before, after */
/* eslint-disable no-magic-numbers */

import assert from 'assert';
import * as app from '../../../server/app';
import request from 'supertest';
import {COIConstants} from '../../../COIConstants';
import hashCode from '../../../hash';
import { OK, FORBIDDEN } from '../../../HTTPStatusCodes';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/ConnectionManager').default;
}
const knex = getKnex({});

const source = 'KC';
const sourceId = '1';
const user1 = 'ProjectControllerTest1';
const user1Id = hashCode(user1);
const user2 = 'ProjectControllerTest2';
const user2Id = hashCode(user2);
const today = new Date();
const disclosureIds = [];
const financialEntityIds = [];
let projectIds = [];
const projectPersonIds = [];
const archiveIds = [];
let inProgressStatus;
async function createUserData(projectId, userId, role) {
  const projectPersonId = await knex('project_person')
    .insert({
      project_id: projectId,
      person_id: userId,
      source_person_type: 'person',
      role_cd: role,
      active: true
    }, 'id');

  projectPersonIds.push(projectPersonId[0]);

  const disclosureId = await knex('disclosure')
    .insert({
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
      status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
      user_id: userId,
      start_date: today,
      config_id: 1
    }, 'id');

  disclosureIds.push(disclosureId[0]);

  const finEntityId = await knex('fin_entity')
    .insert({
      disclosure_id: disclosureIds[0],
      status: COIConstants.RELATIONSHIP_STATUS.IN_PROGRESS,
      active: true
    }, 'id');

  financialEntityIds.push(finEntityId[0]);

  const archive = await knex('disclosure_archive').insert({
    disclosure_id: disclosureId,
    approved_by: 'admin',
    approved_date: new Date(),
    disclosure: JSON.stringify({
      declarations: [{project_id: projectId}]
    })
  }, 'id');

  archiveIds.push(archive[0]);
}

async function addDeclaration(projectId, disclosureId, entityId) {
  await knex('declaration').insert({
    disclosure_id: disclosureId,
    fin_entity_id: entityId,
    project_id: projectId
  }, 'id');
}

describe('ProjectControllerTest', () => {

  before(async function(){
    inProgressStatus = await knex('disclosure_status')
      .select('description')
      .where({
        status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS
      });

    const projectType = await knex('project_type').min('type_cd as typeCd');

    projectIds = await knex('project')
      .insert({
        title: 'project test',
        type_cd: projectType[0].typeCd,
        source_system: source,
        source_identifier: sourceId
      }, 'id');

    await createUserData(projectIds[0], user1Id, 'PI');
    await createUserData(projectIds[0], user2Id, 'COI');
  });

  describe('api/coi/project-disclosure-statuses/:sourceId/:projectId', () => {
    it('should return not yet disclosed if no declaration are present', async function() {
      await knex('declaration').del();
      const response = await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/${source}/${sourceId}`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const statuses = response.body;
      assert.equal(statuses.length, 2);

      const user1Status = statuses.find(status => {
        return status.userId === user1Id.toString();
      });
      assert(user1Status);
      assert.equal(user1Status.status, COIConstants.NOT_YET_DISCLOSED);

      const user2Status = statuses.find(status => {
        return status.userId === user2Id.toString();
      });
      assert(user2Status);
      assert.equal(user2Status.status, COIConstants.NOT_YET_DISCLOSED);
    });

    it('should return the disclosure status if declarations are present', async function() {
      await addDeclaration(projectIds[0],disclosureIds[0],financialEntityIds[0]);


      const response = await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/${source}/${sourceId}`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const statuses = response.body;
      assert.equal(statuses.length, 2);

      const user1Status = statuses.find(status => {
        return status.userId === user1Id.toString();
      });
      assert(user1Status);
      assert.equal(user1Status.status, inProgressStatus[0].description);

      const user2Status = statuses.find(status => {
        return status.userId === user2Id.toString();
      });
      assert(user2Status);
      assert.equal(user2Status.status, COIConstants.NOT_YET_DISCLOSED);
    });

    it('should return empty array', async function() {
      const response = await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/NOSOURCE/NOID`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const statuses = response.body;
      assert.equal(statuses.length, 0);
    });

    it('should return forbidden for non admins', async function() {
      await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/NOSOURCE/NOID`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });
  });

  describe('api/coi/project-disclosure-statuses/:sourceId/:projectId/:personId', () => {
    it('should return not yet disclosed if no declaration are present', async function() {
      await knex('declaration').del();
      const response = await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/${source}/${sourceId}/${user1Id}`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const status = response.body;

      assert(status);
      assert.equal(status.status, COIConstants.NOT_YET_DISCLOSED);
      assert.equal(status.userId, user1Id);
    });

    it('should return the disclosure status if declarations are present', async function() {
      await addDeclaration(projectIds[0],disclosureIds[0],financialEntityIds[0]);
      const response = await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/${source}/${sourceId}/${user1Id}`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const status = response.body;
      assert(status);
      assert.equal(status.status, inProgressStatus[0].description);
      assert.equal(status.userId, user1Id);
    });

    it('should return empty object', async function() {
      const response = await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/NOSOURCE/NOID/NOPERSON`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const status = response.body;
      assert(status);
    });

    it('should return forbidden for non admins', async function() {
      await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/NOSOURCE/NOID/NOPERSON`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });
  });


  after(async function() {
    await knex('declaration').del();
    await knex('project_person').del().whereIn('id', projectPersonIds);
    await knex('project').del().whereIn('id', projectIds);
    await knex('disclosure_archive').del().whereIn('id', archiveIds);
    await knex('fin_entity').del().whereIn('id', financialEntityIds);
    await knex('disclosure').del().whereIn('id', disclosureIds);
  });
});