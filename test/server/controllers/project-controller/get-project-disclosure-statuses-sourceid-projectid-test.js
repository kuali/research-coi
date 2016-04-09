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
import {COIConstants} from '../../../../coi-constants';
import { OK, FORBIDDEN } from '../../../../http-status-codes';
import {
  createProject,
  insertProject,
  createPerson,
  insertProjectPerson,
  createDisclosure,
  insertDisclosure,
  createDeclaration,
  insertDeclaration,
  createEntity,
  insertEntity
} from '../../../test-utils';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});


describe('GET /api/coi/project-disclosure-statuses/:sourceId/:projectId', () => {
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

  describe('get statuses for all persons on project', () => {
    let statuses;
    before(async () => {
      const projectId = await insertProject(knex, createProject(1));
      await insertProjectPerson(knex, createPerson(1, 'PI', true), projectId);
      await insertProjectPerson(knex, createPerson(2, 'COI', true), projectId);
      await insertProjectPerson(knex, createPerson(3, 'PI', true), projectId);
      const disclosureId = await insertDisclosure(knex, createDisclosure(COIConstants.DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL),3);
      const finEntityId = await insertEntity(knex, createEntity(disclosureId,COIConstants.RELATIONSHIP_STATUS.IN_PROGRESS, true));
      await insertDeclaration(knex, createDeclaration(disclosureId, finEntityId, projectId));
    });

    it('should return OK status', async () => {
      const response = await request(app.run())
        .get('/api/coi/project-disclosure-statuses/KC-PD/1/')
        .set('Authorization', `Bearer admin`)
        .expect(OK);

      statuses = response.body;
    });

    it('should return not yet disclosed for user 1', () => {
      assert.equal(COIConstants.NOT_YET_DISCLOSED, statuses.find(status => status.userId === '1').status);
    });

    it('should return no required for user 2', () => {
      assert.equal(COIConstants.DISCLOSURE_NOT_REQUIRED, statuses.find(status => status.userId === '2').status);
    });

    it('should return submitted for Approval for user 3', () => {
      assert.equal('Submitted for Approval', statuses.find(status => status.userId === '3').status);
    });
  });


  describe('test errors and permissions', () => {
    it('should return empty array', async function() {
      const response = await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/NOSOURCE/NOID`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const status = response.body;
      assert.equal(true, Array.isArray(status));
    });

    it('should return forbidden for non admins', async function() {
      await request(app.run())
        .get(`/api/coi/project-disclosure-statuses/NOSOURCE/NOID`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });
  });

  after(async function() {
    await knex('declaration').del();
    await knex('project_type').update({req_disclosure: false});
    await knex('project_role').del();
    await knex('project_status').del();
    await knex('project_person').del();
    await knex('project').del();
    await knex('fin_entity').del();
    await knex('disclosure').del();
  });
});
