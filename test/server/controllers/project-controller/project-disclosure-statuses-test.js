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
  DISCLOSURE_STATUS,
  RELATIONSHIP_STATUS
} from '../../../../coi-constants';
import { OK } from '../../../../http-status-codes';
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
  insertEntity,
  cleanUp
} from '../../../test-utils';
import getKnex from '../../../../server/db/connection-manager';

const knex = getKnex({});

describe('GET /api/coi/project-disclosure-statuses/:sourceId/:projectId', () => {
  let project1;
  let project2;
  let projectPerson1;
  let projectPerson2;
  let disclosure;
  let dispositionTypeCd;
  let declaration;
  let entity;
  let statusCd;
  let roleCd;

  before(async () => {
    dispositionTypeCd = (
      await knex('disposition_type')
        .insert({
          description: 'test',
          order: 1,
          active: true
        }, 'type_cd')
    )[0];

    statusCd = (
      await knex('project_status')
        .insert({
          project_type_cd: 1,
          source_status_cd: 1,
          description: 'In Progress',
          req_disclosure: 1,
          active: '1'
        }, 'type_cd')
    )[0];

    roleCd = (
      await knex('project_role')
        .insert({
          project_type_cd: 1,
          source_role_cd: 'PI',
          description: 'Principal Investigator, PI/Contact',
          req_disclosure: 1,
          active: '1'
        }, 'type_cd')
    )[0];

    await knex('project_type')
      .update({
        req_disclosure: true
      })
      .where({
        type_cd: 1
      });

    project1 = createProject(1);
    project1.id = await insertProject(knex, project1);

    project2 = createProject(2);
    project2.id = await insertProject(knex, project2);

    projectPerson1 = createPerson(999, 'PI', true);
    projectPerson1.id = await insertProjectPerson(
      knex,
      projectPerson1,
      project1.id,
      dispositionTypeCd,
      true
    );
    projectPerson2 = createPerson(999, 'PI', true);
    projectPerson2.id = await insertProjectPerson(
      knex,
      projectPerson2,
      project2.id,
      dispositionTypeCd,
      true
    );

    disclosure = createDisclosure(DISCLOSURE_STATUS.UP_TO_DATE);
    disclosure.id = await insertDisclosure(knex, disclosure, 999);

    entity = createEntity(disclosure.id, RELATIONSHIP_STATUS.DISCLOSED, true);
    entity.id = await insertEntity(knex, entity);

    declaration = createDeclaration(disclosure.id, entity.id, project1.id);
    declaration.id = await insertDeclaration(knex, declaration);
  });

  it('gets correct project status', async () => {
    let response = await request(app.run())
      .get(`/api/coi/project-disclosure-statuses/KC-PD/${1}`)
      .set('Authorization','Bearer admin')
      .expect(OK);

    assert.equal(response.body[0].annualDisclosureStatus, 'Up to Date');
    assert.equal(
      response.body[0].status,
      PROJECT_DISCLOSURE_STATUSES.UP_TO_DATE
    );

    response = await request(app.run())
      .get(`/api/coi/project-disclosure-statuses/KC-PD/${2}`)
      .set('Authorization','Bearer admin')
      .expect(OK);

    assert.equal(response.body[0].annualDisclosureStatus, 'Up to Date');
    assert.equal(
      response.body[0].status,
      PROJECT_DISCLOSURE_STATUSES.UPDATE_NEEDED
    );
  });
  
  after(async () => {
    await cleanUp(knex, 'declaration', declaration.id);
    await cleanUp(knex, 'fin_entity', entity.id);
    await cleanUp(knex, 'disclosure', disclosure.id);
    await cleanUp(knex, 'project_person', projectPerson1.id);
    await cleanUp(knex, 'project_person', projectPerson2.id);
    await cleanUp(knex, 'project_sponsor', project1.id, 'project_id');
    await cleanUp(knex, 'disposition_type', dispositionTypeCd, 'type_cd');
    await cleanUp(knex, 'project', project1.id);
    await cleanUp(knex, 'project_status', statusCd, 'type_cd');
    await cleanUp(knex, 'project_role', roleCd, 'type_cd');
    await knex('project_type')
      .update({
        req_disclosure: true
      })
      .where({
        type_cd: 0
      });
  });
});
