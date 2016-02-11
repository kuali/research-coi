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
import {COIConstants} from '../../../coi-constants';
import hashCode from '../../../hash';
import {formatDate} from '../../../client/scripts/format-date';
import { ACCEPTED, OK, FORBIDDEN, INTERNAL_SERVER_ERROR} from '../../../http-status-codes';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
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

function createComment(disclosureId, user) {
  return {
    disclosureId,
    topicSection: COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE,
    topicId: 1,
    text: 'blah',
    userId: hashCode(user),
    author: user,
    date: new Date(),
    visibleToPI: true,
    visibleToReviewers: true
  };
}

describe('DisclosureController',async () => {
  let disclosureId;
  let disclosure1Id;
  let additionalReviewerId;
  const user = 'DisclosureControllerTest';
  const userId = hashCode(user);
  const reviewer = 'reviewerDisclosureControllerTest';
  const reviewerId = hashCode(reviewer);
  const today = new Date();

  before(async function(){
    const disclosure = await knex('disclosure').insert({
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
      status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
      user_id: userId,
      start_date: today,
      config_id: 1}, 'id');

    disclosureId = disclosure[0];

    const additionalReviewer = await knex('additional_reviewer').insert({
      disclosure_id: disclosureId,
      user_id: reviewerId,
      name: reviewer,
      email: 'test@test.com'
    },'id');

    additionalReviewerId = additionalReviewer[0];

    const disclosure1 = await knex('disclosure').insert({
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
      status_cd: COIConstants.DISCLOSURE_STATUS.IN_PROGRESS,
      user_id: userId,
      start_date: today,
      config_id: 1}, 'id');

    disclosure1Id = disclosure1[0];
  });

  describe('/api/coi/disclosure/:id', async () => {
    it('user should be able to retrieve there own disclosures', async function () {
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

    it('user should not be able to retrieve others disclosures', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer cate`)
        .expect(INTERNAL_SERVER_ERROR);
    });

    it('reviewer should be able to retrieve disclosures when they are a reviewer', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer ${reviewer}`)
        .expect(OK);
    });

    it('reviewer should not be able to retrieve disclosures when they are not a reviewer', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer reviewer1234`)
        .expect(FORBIDDEN);
    });

    it('admin should be able to retrieve disclosures', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer admin`)
        .expect(OK);
    });
  });

  describe('/api/coi/disclosure-summaries', async () => {
    it('user should not be able to retrieve disclosure summaries', async function () {
      await request(app.run())
        .get(`/api/coi/disclosure-summaries`)
        .set('Authorization', `Bearer cate`)
        .expect(FORBIDDEN);
    });

    it('reviewer should be able to retrieve disclosure summaries when they are a reviewer', async function () {
      const response = await request(app.run())
        .get(`/api/coi/disclosure-summaries`)
        .set('Authorization', `Bearer ${reviewer}`)
        .expect(OK);

      const summaries = response.body;
      assert.equal(summaries.length, 1);
    });

    it('reviewer should not be able to retrieve disclosure summaries when they are not a reviewer', async function () {
      const response = await request(app.run())
        .get(`/api/coi/disclosure-summaries`)
        .set('Authorization', `Bearer reviewer1234`)
        .expect(OK);

      const summaries = response.body;
      assert.equal(summaries.length, 0);
    });

    it('admin should be able to retrieve disclosures', async function () {
      const response = await request(app.run())
        .get(`/api/coi/disclosure-summaries`)
        .set('Authorization', `Bearer admin`)
        .expect(OK);

      const summaries = response.body;
      assert.equal(summaries.length, 2);
    });
  });

  describe('/api/coi/disclosures/:id/comments', async () => {
    it('user should not be able add comments', async function () {
      await request(app.run())
        .post(`/api/coi/disclosures/${disclosureId}/comments`)
        .send(createComment(disclosureId, 'cate'))
        .set('Authorization', `Bearer cate`)
        .expect(FORBIDDEN);
    });

    it('admin should be able add comments', async function () {
      await request(app.run())
        .post(`/api/coi/disclosures/${disclosureId}/comments`)
        .send(createComment(disclosureId, 'admin'))
        .set('Authorization', `Bearer admin`)
        .expect(OK);
    });

    it('reviewer should be able add comments to disclosures when they are a reviewer', async function () {
      await request(app.run())
        .post(`/api/coi/disclosures/${disclosureId}/comments`)
        .send(createComment(disclosureId, reviewer))
        .set('Authorization', `Bearer ${reviewer}`)
        .expect(OK);
    });

    it('reviewer should not be able add comments to disclosures when they are not a reviewer', async function () {
      await request(app.run())
        .post(`/api/coi/disclosures/${disclosure1Id}/comments`)
        .send(createComment(disclosure1Id, reviewer))
        .set('Authorization', `Bearer ${reviewer}`)
        .expect(FORBIDDEN);
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
        .select('status_cd','submitted_by', 'submitted_date', 'expired_date')
        .where({id: disclosure.id});

      assert.equal(submittedDisclosure[0].status_cd, COIConstants.DISCLOSURE_STATUS.UP_TO_DATE);
      assert.equal(submittedDisclosure[0].submitted_by, `User ${user}`);
      assert(new Date(submittedDisclosure[0].expired_date) > today);

      const disclosureArchive = await knex('disclosure_archive')
        .select('*')
        .where({disclosure_id: disclosureId});

      assert.equal(disclosureArchive[0].approved_by, COIConstants.SYSTEM_USER);
      assert.equal(formatDate(disclosureArchive[0].approved_date), formatDate(today));

    });
  });

  after(async function() {
    await knex('comment').del().whereIn('disclosure_id', [disclosureId, disclosure1Id]);
    await knex('additional_reviewer').del().where({id: additionalReviewerId});
    await knex('disclosure_archive').del().whereIn('disclosure_id', [disclosureId, disclosure1Id]);
    await knex('disclosure').del().whereIn('id',[disclosureId, disclosure1Id]);
  });
});