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
import * as app from '../../../../server/app';
import request from 'supertest';
import {
  PROJECT_DISCLOSURE_STATUSES,
  RELATIONSHIP_STATUS,
  DISCLOSURE_STATUS,
  NO_DISPOSITION_DESCRIPTION
} from '../../../../coi-constants';
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
import getKnex from '../../../../server/db/connection-manager';

const knex = getKnex({});

describe('GET /api/coi/project-disclosure-statuses/:sourceId/:projectId/:personId', () => {
  let dispositionTypeCd;

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
    const dispositionType = await knex('disposition_type').insert({
      description: 'test',
      order: 1,
      active: true
    }, 'type_cd');

    dispositionTypeCd = dispositionType[0];
  });

  describe('get status for project with no disclosure', () => {
    let status;
    before(async () => {
      const projectId = await insertProject(knex, createProject(1));
      await insertProjectPerson(knex, createPerson(1, 'PI', true), projectId);
    });

    it('should return OK status', async () => {
      const response = await request(app.run())
        .get('/api/coi/project-disclosure-statuses/KC-PD/1/1')
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      status = response.body;
    });

    it('should return not yet disclosed', () => {
      assert.equal(1, status.userId);
      assert.equal(PROJECT_DISCLOSURE_STATUSES.NOT_YET_DISCLOSED, status.status);
    });
  });

  describe('get status for not required', () => {
    let status;
    before(async () => {
      const projectId = await insertProject(knex, createProject(2));
      await insertProjectPerson(knex, createPerson(2, 'COI', true), projectId, dispositionTypeCd);
    });

    it('should return OK status', async () => {
      const response = await request(app.run())
        .get('/api/coi/project-disclosure-statuses/KC-PD/2/2')
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      status = response.body;
    });

    it('should return not required', () => {
      assert.equal(2, status.userId);
      assert.equal(
        PROJECT_DISCLOSURE_STATUSES.DISCLOSURE_NOT_REQUIRED,
        status.status
      );
      assert.equal('test', status.disposition);
    });
  });

  describe('get status for undeclared project', () => {
    before(async () => {
      const projectId = await insertProject(knex, createProject(3));
      await insertProjectPerson(knex, createPerson(3, 'PI', true), projectId);
      const disclosureId = await insertDisclosure(
        knex,
        createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL),
        3
      );
      await insertEntity(
        knex,
        createEntity(disclosureId,RELATIONSHIP_STATUS.IN_PROGRESS, true)
      );
    });

    it('should return update needed', async () => {
      const response = await request(app.run())
        .get('/api/coi/project-disclosure-statuses/KC-PD/3/3')
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      const status = response.body;

      assert.equal(3, status.userId);
      assert.equal(PROJECT_DISCLOSURE_STATUSES.UPDATE_NEEDED, status.status);
      assert.equal(NO_DISPOSITION_DESCRIPTION, status.disposition);
    });
  });

  describe('get disclosure status', () => {
    let status;
    before(async () => {
      const projectId = await insertProject(knex, createProject(4));
      await insertProjectPerson(knex, createPerson(4, 'PI', true), projectId);
      const disclosureId = await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL),4);
      const finEntityId = await insertEntity(knex, createEntity(disclosureId,RELATIONSHIP_STATUS.IN_PROGRESS, true));
      await insertDeclaration(knex, createDeclaration(disclosureId, finEntityId, projectId));
    });

    it('should return OK status', async () => {
      const response = await request(app.run())
        .get('/api/coi/project-disclosure-statuses/KC-PD/4/4')
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      status = response.body;
    });

    it('should return submitted for approval', () => {
      assert.equal(4, status.userId);
      assert.equal('Submitted for Approval', status.status);
      assert.equal(NO_DISPOSITION_DESCRIPTION, status.disposition);
    });
  });

  describe('get disclosure status when no fin entities', () => {
    let status;
    before(async () => {
      const projectId = await insertProject(knex, createProject(5));
      await insertProjectPerson(knex, createPerson(5, 'PI', true), projectId);
      await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL),5);
    });

    it('should return OK status', async () => {
      const response = await request(app.run())
        .get('/api/coi/project-disclosure-statuses/KC-PD/5/5')
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      status = response.body;
    });

    it('should return submitted for approval', () => {
      assert.equal(5, status.userId);
      assert.equal('Submitted for Approval', status.status);
      assert.equal(NO_DISPOSITION_DESCRIPTION, status.disposition);
    });
  });

  describe('test errors and permissions', () => {
    it('should return empty object', async function() {
      const response = await request(app.run())
        .get('/api/coi/project-disclosure-statuses/NOSOURCE/NOID/NOPERSON')
        .set('Authorization','Bearer admin')
        .expect(OK);

      const status = response.body;
      assert.deepEqual({}, status);
    });

    it('should return forbidden for non admins', async function() {
      await request(app.run())
        .get('/api/coi/project-disclosure-statuses/NOSOURCE/NOID/NOPERSON')
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
    await knex('project_sponsor').del();
    await knex('project').del();
    await knex('fin_entity').del();
    await knex('disclosure').del();
    await knex('disposition_type').del();
  });
});
