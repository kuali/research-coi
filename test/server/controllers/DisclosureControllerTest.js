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
import {formatDate} from '../../../client/scripts/formatDate';
import { ACCEPTED, OK} from '../../../HTTPStatusCodes';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/ConnectionManager').default;
}
const knex = getKnex({});

async function updateAutoApprove(value) {
  const configResult = await knex('config').select('config').where({id: 1});
  const config = JSON.parse(configResult[0].config);

  config.general.autoApprove = value;

  await knex('config').update({config: JSON.stringify(config)}).where({id: 1});
}

async function addFinancialEntity(id) {
  await knex('fin_entity').insert({
    disclosure_id: id,
    status: COIConstants.RELATIONSHIP_STATUS.PENDING,
    active: true
  });
}

async function removeFinancialEntity(id) {
  await knex('fin_entity')
    .del()
    .where({disclosure_id: id});
}

async function changeDisclosureStatus(status, id) {
  await knex('disclosure')
    .update({
      status_cd: status,
      submitted_by: null,
      submitted_date: null
    })
    .where({id});
}

describe('DisclosureController',async () => {
  let disclosureId;
  const user = 'DisclosureControllerTest';
  const userId = hashCode(user);
  const today = new Date();

  before(async function(){
    const disclosure = await knex('disclosure').insert({
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
      status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
      user_id: userId,
      start_date: today,
      config_id: 1}, 'id');

    disclosureId = disclosure[0];
  });

  describe('/api/coi/disclosure/:id', async () => {
    it('should retrieve a disclosure with given id ', async function () {
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer ${user}`)
        .expect(OK);

      const disclosure = response.body;
      assert.equal(disclosure.id, disclosureId);
      assert.equal(disclosure.typeCd, COIConstants.DISCLOSURE_TYPE.ANNUAL);
      assert.equal(disclosure.statusCd, COIConstants.DISCLOSURE_STATUS.IN_PROGRESS);
      assert.equal(formatDate(disclosure.startDate), formatDate(today));
    });
  });

  describe('/api/coi/disclosure/:id/submit', async () => {
    it('should submit disclosure if auto approve is false ', async function () {
      await updateAutoApprove(false);
      await changeDisclosureStatus(COIConstants.DISCLOSURE_STATUS.IN_PROGRESS, disclosureId);
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer ${user}`)
        .expect(OK);

      const disclosure = response.body;

      assert(!disclosure.submittedBy);

      await request(app.run())
        .put(`/api/coi/disclosures/${disclosure.id}/submit`)
        .send(disclosure)
        .set('Authorization', `Bearer ${user}`)
        .expect(ACCEPTED);

      const submittedDisclosure = await knex('disclosure')
        .select('status_cd','submitted_by', 'submitted_date')
        .where({id: disclosure.id});

      assert.equal(submittedDisclosure[0].status_cd, COIConstants.DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL);
      assert.equal(submittedDisclosure[0].submitted_by, `User ${user}`);
      assert.equal(formatDate(submittedDisclosure[0].submitted_date), formatDate(today));
    });

    it('should submit disclosure if auto approve is true but there are financial entities ', async function () {
      await updateAutoApprove(true);
      await changeDisclosureStatus(COIConstants.DISCLOSURE_STATUS.IN_PROGRESS, disclosureId);
      await addFinancialEntity(disclosureId);
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer ${user}`)
        .expect(OK);

      const disclosure = response.body;

      assert(!disclosure.submittedBy);

      await request(app.run())
        .put(`/api/coi/disclosures/${disclosure.id}/submit`)
        .send(disclosure)
        .set('Authorization', `Bearer ${user}`)
        .expect(ACCEPTED);

      const submittedDisclosure = await knex('disclosure')
        .select('status_cd','submitted_by', 'submitted_date')
        .where({id: disclosure.id});

      assert.equal(submittedDisclosure[0].status_cd, COIConstants.DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL);
      assert.equal(submittedDisclosure[0].submitted_by, `User ${user}`);
      assert.equal(formatDate(submittedDisclosure[0].submitted_date), formatDate(today));

      await removeFinancialEntity(disclosureId);
    });

    it('should submit and approve disclosure if auto approve is true but there are no financial entities ', async function () {
      await updateAutoApprove(true);
      await changeDisclosureStatus(COIConstants.DISCLOSURE_STATUS.IN_PROGRESS, disclosureId);
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer ${user}`)
        .expect(OK);

      const disclosure = response.body;

      assert(!disclosure.submittedBy);

      await request(app.run())
        .put(`/api/coi/disclosures/${disclosure.id}/submit`)
        .send(disclosure)
        .set('Authorization', `Bearer ${user}`)
        .expect(ACCEPTED);

      const submittedDisclosure = await knex('disclosure')
        .select('status_cd','submitted_by', 'submitted_date')
        .where({id: disclosure.id});

      assert.equal(submittedDisclosure[0].status_cd, COIConstants.DISCLOSURE_STATUS.UP_TO_DATE);
      assert.equal(submittedDisclosure[0].submitted_by, `User ${user}`);
      assert.equal(formatDate(submittedDisclosure[0].submitted_date), formatDate(today));


      const disclosureArchive = await knex('disclosure_archive')
        .select('*')
        .where({disclosure_id: disclosureId});

      assert.equal(disclosureArchive[0].approved_by, COIConstants.SYSTEM_USER);
      assert.equal(formatDate(disclosureArchive[0].approved_date), formatDate(today));

    });
  });

  after(async function() {
    await knex('disclosure_archive').del().where({disclosure_id: disclosureId});
    await knex('disclosure').del().where({id: disclosureId});
  });
});