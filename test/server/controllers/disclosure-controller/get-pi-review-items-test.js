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
import getKnex from '../../../../server/db/connection-manager';
import {
  createProject,
  insertProject,
  createPerson,
  insertProjectPerson,
  createDisclosure,
  insertDisclosure,
  createEntity,
  insertEntity
} from '../../../test-utils';
import { RELATIONSHIP_STATUS } from '../../../../coi-constants';
import hashCode from '../../../../hash';
import { OK } from '../../../../http-status-codes';
import { setFeatureFlagState } from '../../../../server/db/features-db';
const knex = getKnex({});

describe('get /api/coi/disclosures/:id/pi-review-items', async () => {
  let disclosureId;
  before(async() => {
    await setFeatureFlagState(knex, 'RESCOI-941', true);
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

  describe('disclosure with FE and project with no declaration', () => {
    let reviewItems;
    before(async () => {
      disclosureId = await insertDisclosure(knex, createDisclosure(4), hashCode('pi-review-items'));
      await insertEntity(knex,createEntity(disclosureId, RELATIONSHIP_STATUS.IN_PROGRESS, true));
      const projectId = await insertProject(knex, createProject(1));
      await insertProjectPerson(knex,createPerson(hashCode('pi-review-items'), 'PI', true),projectId,null,true);
    });

    it('should return an OK status', async () => {
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}/pi-review-items`)
        .set('Authorization', 'Bearer pi-review-items')
        .expect(OK);

      reviewItems = response.body;
    });

    it('should have a valid declaration on the response', () => {
      assert.equal(reviewItems.declarations.length, 1);
      assert.equal(reviewItems.declarations[0].entities.length, 1);
    });

    it('should create a new declaration in the db', async () => {
      const declarations = await knex.select('*')
        .from('declaration')
        .where({
          disclosure_id: disclosureId
        });
      assert.equal(declarations.length, 1);
      assert.equal(declarations[0].disclosure_id, disclosureId);
    });

    after(async () => {
      await knex('declaration').del();
      await knex('project_person').del();
      await knex('project_sponsor').del();
      await knex('project').del();
      await knex('fin_entity').del();
      await knex('disclosure').del();
    });
  });

  describe('disclosure with no FE and project with no declaration', () => {
    let reviewItems;
    before(async () => {
      disclosureId = await insertDisclosure(knex, createDisclosure(4), hashCode('pi-review-items'));
      const projectId = await insertProject(knex, createProject(1));
      await insertProjectPerson(knex,createPerson(hashCode('pi-review-items'), 'PI', true),projectId,null,true);
    });

    it('should return an OK status', async () => {
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}/pi-review-items`)
        .set('Authorization', 'Bearer pi-review-items')
        .expect(OK);

      reviewItems = response.body;
    });

    it('should not have a valid declaration on the response', () => {
      assert.equal(reviewItems.declarations.length, 0);
    });

    it('should not create a new declaration in the db', async () => {
      const declarations = await knex.select('*').
      from('declaration')
        .where({
          disclosure_id: disclosureId
        });
      assert.equal(declarations.length, 0);
    });

    after(async () => {
      await knex('declaration').del();
      await knex('project_person').del();
      await knex('project_sponsor').del();
      await knex('project').del();
      await knex('fin_entity').del();
      await knex('disclosure').del();
    });
  });

  describe('disclosure with multiple FE and project with no declaration', () => {
    let reviewItems;
    before(async () => {
      disclosureId = await insertDisclosure(knex, createDisclosure(4), hashCode('pi-review-items'));
      await insertEntity(knex,createEntity(disclosureId, RELATIONSHIP_STATUS.IN_PROGRESS, true));
      await insertEntity(knex,createEntity(disclosureId, RELATIONSHIP_STATUS.IN_PROGRESS, true));
      await insertEntity(knex,createEntity(disclosureId, RELATIONSHIP_STATUS.IN_PROGRESS, false));
      const projectId = await insertProject(knex, createProject(1));
      await insertProjectPerson(knex,createPerson(hashCode('pi-review-items'), 'PI', true),projectId,null,true);
      const projectId1 = await insertProject(knex, createProject(2));
      await insertProjectPerson(knex,createPerson(hashCode('pi-review-items'), 'PI', true),projectId1,null,true);
    });

    it('should return an OK status', async () => {
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}/pi-review-items`)
        .set('Authorization', 'Bearer pi-review-items')
        .expect(OK);

      reviewItems = response.body;
    });

    it('should have a valid declaration on the response', () => {
      assert.equal(reviewItems.declarations.length, 2);
      assert.equal(reviewItems.declarations[0].entities.length, 2);
      assert.equal(reviewItems.declarations[1].entities.length, 2);
    });

    it('should create a new declaration in the db', async () => {
      const declarations = await knex.select('*')
        .from('declaration').
        where({
          disclosure_id: disclosureId
        });
      assert.equal(declarations.length, 4); //2 entities * 2 projects = 4 declarations
      assert.equal(declarations[0].disclosure_id, disclosureId);
      assert.equal(declarations[1].disclosure_id, disclosureId);
    });

    after(async () => {
      await knex('declaration').del();
      await knex('project_person').del();
      await knex('project_sponsor').del();
      await knex('project').del();
      await knex('fin_entity').del();
      await knex('disclosure').del();
    });
  });

  after(async () => {
    await knex('project_type').update({req_disclosure: false});
    await knex('project_role').del();
    await knex('project_status').del();
  });
});