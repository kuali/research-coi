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
import {
  RELATIONSHIP_STATUS,
  DISCLOSURE_TYPE,
  DISCLOSURE_STATUS,
  DATE_TYPE,
  SYSTEM_USER
} from '../../../coi-constants';
import hashCode from '../../../hash';
import {formatDate} from '../../../client/scripts/format-date';
import { ACCEPTED, OK, FORBIDDEN, INTERNAL_SERVER_ERROR} from '../../../http-status-codes';
import { createDisclosure, insertDisclosure, createComment } from '../../test-utils';
import getKnex from '../../../server/db/connection-manager';

const knex = getKnex({});

async function updateConfig(autoApprove, addReviewers) {
  const maxConfigRow = await knex
    .max('id as id')
    .from('config');

  const configResult = await knex('config')
    .select('config')
    .where({id: maxConfigRow[0].id});
  const config = JSON.parse(configResult[0].config);

  config.general.autoApprove = autoApprove;
  config.general.autoAddAdditionalReviewer = addReviewers;
  await knex('config')
    .update({config: JSON.stringify(config)})
    .where({id: maxConfigRow[0].id});
}

async function addFinancialEntity(id) {
  await knex('fin_entity').insert({
    disclosure_id: id,
    status: RELATIONSHIP_STATUS.PENDING,
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
  let disclosure1Id;
  const user = 'DisclosureControllerTest';
  const userId = hashCode(user);
  const reviewer = 'reviewerDisclosureControllerTest';
  const reviewerId = hashCode(reviewer);
  const today = new Date();

  before(async function() {
    const disclosure = await knex('disclosure').insert({
      type_cd: DISCLOSURE_TYPE.ANNUAL,
      status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
      user_id: userId,
      start_date: today,
      config_id: 1}, 'id');

    disclosureId = disclosure[0];

    await knex('additional_reviewer').insert({
      disclosure_id: disclosureId,
      user_id: reviewerId,
      name: reviewer,
      email: 'test@test.com',
      active: true,
      dates: JSON.stringify([{
        type: DATE_TYPE.ASSIGNED,
        date: new Date(2016,0,0)
      }])
    },'id');

    const disclosure1 = await knex('disclosure').insert({
      type_cd: DISCLOSURE_TYPE.ANNUAL,
      status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
      user_id: userId,
      start_date: today,
      config_id: 1}, 'id');

    disclosure1Id = disclosure1[0];

    const projectType = await knex('project_type').min('type_cd as typeCd');

    const projectId = await knex('project')
      .insert({
        title: 'project test',
        type_cd: projectType[0].typeCd,
        source_system: 'propdev',
        source_identifier: 1
      }, 'id');

    await knex('project_person')
      .insert({
        project_id: projectId[0],
        person_id: userId,
        source_person_type: 'person',
        role_cd: 'PI',
        active: true
      }, 'id');
  });

  describe('/api/coi/disclosure/:id', async () => {
    it('user should be able to retrieve there own disclosures', async function () {
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer ${user}`)
        .expect(OK);

      const disclosure = response.body;
      assert.equal(disclosure.id, disclosureId);
      assert.equal(disclosure.typeCd, DISCLOSURE_TYPE.ANNUAL);
      assert.equal(disclosure.statusCd, DISCLOSURE_STATUS.IN_PROGRESS);
      assert.equal(formatDate(disclosure.startDate), formatDate(today));
      assert.equal(1, disclosure.reviewers.length);
      assert.equal(1, disclosure.reviewers[0].dates.length);
      assert.equal(DATE_TYPE.ASSIGNED, disclosure.reviewers[0].dates[0].type);
    });

    it('user should not be able to retrieve others disclosures', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', 'Bearer cate')
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
        .set('Authorization', 'Bearer reviewer1234')
        .expect(FORBIDDEN);
    });

    it('admin should be able to retrieve disclosures', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', 'Bearer admin')
        .expect(OK);
    });
  });

  describe('/api/coi/disclosures/:id/comments', async () => {
    it('user should not be able add comments', async function () {
      await request(app.run())
        .post(`/api/coi/disclosures/${disclosureId}/comments`)
        .send(createComment(disclosureId, 'cate'))
        .set('Authorization', 'Bearer cate')
        .expect(FORBIDDEN);
    });

    it('admin should be able add comments', async function () {
      await request(app.run())
        .post(`/api/coi/disclosures/${disclosureId}/comments`)
        .send(createComment(disclosureId, 'admin'))
        .set('Authorization', 'Bearer admin')
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
      await updateConfig(false, false);
      await changeDisclosureStatus(DISCLOSURE_STATUS.IN_PROGRESS, disclosureId);
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

      const projectPersons = await knex('project_person')
        .select('new')
        .where({person_id: userId});

      assert.equal(false, projectPersons[0].new);
      assert.equal(submittedDisclosure[0].status_cd, DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL);
      assert.equal(submittedDisclosure[0].submitted_by, `User ${user}`);
      assert.equal(formatDate(submittedDisclosure[0].submitted_date), formatDate(today));
    });

    it('return submitted disclosure ', async function () {
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}`)
        .set('Authorization', `Bearer ${user}`)
        .expect(OK);
      const disclosure = response.body;
      assert(disclosure.submittedBy != undefined);

      const comment = {text: 'Hey there', disclosureId: disclosure.id};
      await request(app.run())
        .put(`/api/coi/disclosures/${disclosure.id}/return`)
        .send(comment)
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);

      const returnedDisclosure = await knex('disclosure')
        .select('status_cd','returned_date')
        .where({id: disclosure.id});
      assert(!returnedDisclosure[0].returnedDate);
      assert.equal(returnedDisclosure[0].status_cd, DISCLOSURE_STATUS.RETURNED);

      const generalComment = await knex('general_comment')
        .select('text', 'user_role', 'author', 'date')
        .where({disclosure_id: disclosure.id});
      assert.equal('Hey there', generalComment[0].text);
      assert(generalComment[0].user_role);
      assert(generalComment[0].author);
      assert(generalComment[0].date);
    });

    it('should submit disclosure if auto approve is true but there are financial entities ', async function () {
      await updateConfig(true, false);
      await changeDisclosureStatus(DISCLOSURE_STATUS.IN_PROGRESS, disclosureId);
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

      assert.equal(submittedDisclosure[0].status_cd, DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL);
      assert.equal(submittedDisclosure[0].submitted_by, `User ${user}`);
      assert.equal(formatDate(submittedDisclosure[0].submitted_date), formatDate(today));

      await removeFinancialEntity(disclosureId);
    });

    it('should submit and approve disclosure if auto approve is true but there are no financial entities ', async function () {
      await updateConfig(true, false);
      await changeDisclosureStatus(DISCLOSURE_STATUS.IN_PROGRESS, disclosureId);
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

      assert.equal(submittedDisclosure[0].status_cd, DISCLOSURE_STATUS.UP_TO_DATE);
      assert.equal(submittedDisclosure[0].submitted_by, `User ${user}`);
      assert(new Date(submittedDisclosure[0].expired_date) > today);

      const disclosureArchive = await knex('disclosure_archive')
        .select('*')
        .where({disclosure_id: disclosureId});

      assert.equal(disclosureArchive[0].approved_by, SYSTEM_USER);
      assert.equal(formatDate(disclosureArchive[0].approved_date), formatDate(today));
    });
  });

  describe('test auto add additional reviewers ', () => {
    let discId;
    let disclosure;
    before(async () => {
      await updateConfig(false, true);
      discId = await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.IN_PROGRESS), hashCode('cate'));
    });

    it('should return accepted status', async () => {
      await request(app.run())
        .put(`/api/coi/disclosures/${discId}/submit`)
        .send(disclosure)
        .set('Authorization', 'Bearer cate')
        .expect(ACCEPTED);
    });

    it('should add 2 additional reviewers', async () => {
      const reviewers = await knex('additional_reviewer')
        .select('name')
        .where({disclosure_id: discId});
      assert.equal(2, reviewers.length);
      assert.equal('reviewer1',reviewers[0].name);
      assert.equal('reviewer2',reviewers[1].name);
    });
  });

  describe('test auto add additional reviewers when reviewer is the reporter ', () => {
    let discId;
    let disclosure;
    before(async () => {
      await updateConfig(false, true);
      discId = await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.IN_PROGRESS), hashCode('reviewer1'));
    });

    it('should return accepted status', async () => {
      await request(app.run())
        .put(`/api/coi/disclosures/${discId}/submit`)
        .send(disclosure)
        .set('Authorization', 'Bearer reviewer1')
        .expect(ACCEPTED);
    });

    it('should add only reviewer 2 as an additional reviewer', async () => {
      const reviewers = await knex('additional_reviewer')
        .select('name')
        .where({disclosure_id: discId});
      assert.equal(1, reviewers.length);
      assert.equal('reviewer2',reviewers[0].name);
    });
  });

  after(async function() {
    await updateConfig(false, false);
    await knex('general_comment').del();
    await knex('project_person').del();
    await knex('project_sponsor').del();
    await knex('project').del();
    await knex('review_comment').del();
    await knex('additional_reviewer').del();
    await knex('disclosure_archive').del();
    await knex('disclosure').del();
  });
});
