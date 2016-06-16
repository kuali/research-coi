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
import hashCode from '../../../../hash';
import { DISCLOSURE_STATUS, DISCLOSURE_TYPE, RELATIONSHIP_STATUS } from '../../../../coi-constants';
import { OK, FORBIDDEN } from '../../../../http-status-codes';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

async function insertDisclosure(typeCd, statusCd, revisedDate, submittedDate, submittedBy ) {
  const disclosure = await knex('disclosure').insert({
    type_cd: typeCd,
    status_cd: statusCd,
    user_id: hashCode(submittedBy),
    start_date: new Date(2015,0,1),
    revised_date: revisedDate,
    submitted_date: submittedDate,
    submitted_by: submittedBy,
    config_id: 1}, 'id');

  return disclosure[0];
}

describe('get /api/coi/disclosure-summaries', async () => {
  let dispositionTypeCd;

  before(async() => {
    await insertDisclosure(DISCLOSURE_TYPE.ANNUAL, DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL, null, new Date(2016,1,1), 'bob');
    await insertDisclosure(DISCLOSURE_TYPE.ANNUAL, DISCLOSURE_STATUS.UP_TO_DATE, new Date(2016,1,1), new Date(2016,1,1), 'tom');
    await insertDisclosure(DISCLOSURE_TYPE.ANNUAL, DISCLOSURE_STATUS.EXPIRED, new Date(2015,1,1), new Date(2016,1,1),'tim');
    await insertDisclosure(DISCLOSURE_TYPE.ANNUAL, DISCLOSURE_STATUS.REVISION_REQUIRED, new Date(2017,1,1), new Date(2016,1,1), 'joe');
    await insertDisclosure(DISCLOSURE_TYPE.ANNUAL, DISCLOSURE_STATUS.RESUBMITTED, new Date(2018,1,1), new Date(2016,1,1), 'brandon');
    const disclosureId = await insertDisclosure(DISCLOSURE_TYPE.MANUAL, DISCLOSURE_STATUS.UP_TO_DATE, new Date(2018,1,1), new Date(2016,1,1), 'doug');

    const finEntity = await knex('fin_entity').insert({
      disclosure_id: disclosureId,
      status: RELATIONSHIP_STATUS.PENDING,
      active: true
    }, 'id');

    const dispositionType = await knex('disposition_type')
      .insert(
        {description: 'test',
          order: 1,
          active: 1
        },'type_cd');

    dispositionTypeCd = dispositionType[0];

    const projectId = await knex('project')
      .insert({
        title: 'project test',
        type_cd: 1,
        source_system: 'propdev',
        source_identifier: 1
      }, 'id');

    await knex('project_person')
      .insert({
        project_id: projectId[0],
        person_id: hashCode('doug'),
        source_person_type: 'person',
        role_cd: 'PI',
        active: true,
        disposition_type_cd: dispositionTypeCd
      }, 'id');

    await knex('declaration').insert({
      disclosure_id: disclosureId,
      fin_entity_id: finEntity[0],
      project_id: projectId[0]
    });

    await knex('additional_reviewer').insert({
      user_id: hashCode('reviewer'),
      disclosure_id: disclosureId,
      name: 'reviewer'
    });
  });

  describe('no filter', async () => {
    let summaries;
    it('should return an ok status', async () => {
      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      summaries = response.body;
    });

    it('should return 6 results', () => {
      assert.equal(summaries.length, 6);
    });
  });

  describe('date filter', async () => {
    let summaries;
    it('should return an ok status', async () => {
      const filters = {
        date: {
          start: new Date(2016,0,1).getTime(),
          end: new Date(2016,11,31).getTime()
        }
      };

      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .query({filters: encodeURIComponent(JSON.stringify(filters))})
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      summaries = response.body;
    });

    it('should return 2 results', () => {
      assert.equal(summaries.length, 2);
    });
  });

  describe('status filter', async () => {
    let summaries;
    it('should return an ok status', async () => {
      const filters = {
        status: [DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL]
      };

      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .query({filters: encodeURIComponent(JSON.stringify(filters))})
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      summaries = response.body;
    });

    it('should return 1 results', () => {
      assert.equal(summaries.length, 1);
    });
  });

  describe('search filter', async () => {
    let summaries;
    it('should return an ok status', async () => {
      const filters = {
        search: 'tom'
      };

      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .query({filters: encodeURIComponent(JSON.stringify(filters))})
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      summaries = response.body;
    });

    it('should return 1 results', () => {
      assert.equal(summaries.length, 1);
    });

    it('should return the disclosure submitted by tom', () => {
      assert.equal('tom', summaries[0].submitted_by);
    });
  });

  describe('search filter', async () => {
    let summaries;
    it('should return an ok status', async () => {
      const filters = {
        disposition: [dispositionTypeCd]
      };

      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .query({filters: encodeURIComponent(JSON.stringify(filters))})
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      summaries = response.body;
    });

    it('should return 1 results', () => {
      assert.equal(summaries.length, 1);
    });

    it('should return the disclosure submitted by tom', () => {
      assert.equal('doug', summaries[0].submitted_by);
    });
  });

  describe('reviewer filter', async () => {
    let summaries;
    it('should return an ok status', async () => {
      const filters = {
        reviewers: [hashCode('reviewer')]
      };

      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .query({filters: encodeURIComponent(JSON.stringify(filters))})
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      summaries = response.body;
    });

    it('should return 1 results', () => {
      assert.equal(summaries.length, 1);
    });

    it('should return the disclosure submitted by tom', () => {
      assert.equal('doug', summaries[0].submitted_by);
    });
  });

  describe('test permissions', () => {
    it('user should not be able to retrieve disclosure summaries', async function () {
      await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .set('Authorization', 'Bearer cate')
        .expect(FORBIDDEN);
    });

    it('reviewer should be able to retrieve disclosure summaries when they are a reviewer', async function () {
      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .set('Authorization', 'Bearer reviewer')
        .expect(OK);

      const summaries = response.body;
      assert.equal(summaries.length, 1);
    });

    it('reviewer should not be able to retrieve disclosure summaries when they are not a reviewer', async function () {
      const response = await request(app.run())
        .get('/api/coi/disclosure-summaries')
        .set('Authorization', 'Bearer reviewer1234')
        .expect(OK);

      const summaries = response.body;
      assert.equal(summaries.length, 0);
    });
  });

  after(async () => {
    await knex('declaration').del();
    await knex('fin_entity').del();
    await knex('project_person').del();
    await knex('project_sponsor').del();
    await knex('project').del();
    await knex('additional_reviewer').del();
    await knex('disclosure').del();
  });
});