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

/* eslint-disable no-magic-numbers, camelcase */

import assert from 'assert';
import * as app from '../../../server/app';
import request from 'supertest';
import {COIConstants} from '../../../coi-constants';
import hashCode from '../../../hash';
import { OK, FORBIDDEN, INTERNAL_SERVER_ERROR } from '../../../http-status-codes';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

function getReviewer(disclosureId, user) {
  return {
    userId: hashCode(user),
    disclosureId,
    name: user,
    email: 'test@test.com',
    title: 'Dean',
    unitName: 'Department of Psychology'
  };
}

async function addReviewer(disclosureId, user) {
  const id = await knex('additional_reviewer').insert({
    disclosure_id: disclosureId,
    user_id: hashCode(user),
    name: user,
    email: 'test@test.com'
  },'id');
  return id[0];
}

let disclosureId;
describe('AdditionalReviewerControllerTest', () => {
  before(async function(){
    const disclosure = await knex('disclosure').insert({
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL,
      status_cd: COIConstants.DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL,
      user_id: 1234,
      start_date: new Date(),
      config_id: 1}, 'id');

    disclosureId = disclosure[0];
  });

  describe('/api/coi/additional-reviewers', () => {

    it('should only allow admins to add reviewers', async () => {
      await request(app.run())
        .post('/api/coi/additional-reviewers')
        .send(getReviewer(disclosureId, 'reviewerDeleteTest'))
        .set('Authorization',`Bearer cate`)
        .expect(FORBIDDEN);
    });

    it('should successfully add and return a reviewer with id',async () => {
      const response = await request(app.run())
        .post('/api/coi/additional-reviewers')
        .send(getReviewer(disclosureId, 'reviewerDeleteTest1'))
        .set('Authorization',`Bearer admin`)
        .expect(OK);

      const reviewer = response.body;
      assert(reviewer.id);
    });

    it('should return error if invalid data is provided',async () => {
      await request(app.run())
        .post('/api/coi/additional-reviewers')
        .send({})
        .set('Authorization',`Bearer admin`)
        .expect(INTERNAL_SERVER_ERROR);
    });
  });

  describe('/api/coi/additional-reviewers/:id', async () => {
    it('should not allow users to remove reviewers', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerDeleteTest2');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization',`Bearer cate`)
        .expect(FORBIDDEN);
    });

    it('should not allow reviewers to remove reviewers', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerDeleteTest3');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization',`Bearer reviewerDeleteTest3`)
        .expect(FORBIDDEN);
    });

    it('should allow admins to remove reviewers', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerDeleteTest4');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization',`Bearer admin`)
        .expect(OK);

      const reviewers = await knex('additional_reviewer')
        .select('id')
        .where({id: reviewerId});

      assert.equal(reviewers.length,0);
    });
  });

  describe('/api/coi/additional-reviewers/current/:disclosureId', async () => {
    it('should not allow users to remove current reviewer', async () => {
      await addReviewer(disclosureId,'reviewerDeleteTest5');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/current/${disclosureId}`)
        .set('Authorization',`Bearer cate`)
        .expect(FORBIDDEN);
    });

    it('should not allow users to remove current reviewer', async () => {
      await addReviewer(disclosureId,'reviewerDeleteTest6');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/current/${disclosureId}`)
        .set('Authorization',`Bearer admin`)
        .expect(FORBIDDEN);
    });

    it('should allow reviewers to remove themselves', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerDeleteTest7');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/current/${disclosureId}`)
        .set('Authorization',`Bearer reviewerDeleteTest7`)
        .expect(OK);

      const reviewers = await knex('additional_reviewer')
        .select('id')
        .where({id: reviewerId});

      assert.equal(reviewers.length,0);
    });
  });

  after(async function() {
    await knex('additional_reviewer').del();
    await knex('disclosure').del().where({id: disclosureId});
  });
});