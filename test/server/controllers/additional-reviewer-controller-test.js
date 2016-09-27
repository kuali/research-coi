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
  DATE_TYPE,
  DISCLOSURE_TYPE,
  DISCLOSURE_STATUS
} from '../../../coi-constants';
import hashCode from '../../../hash';
import { OK, FORBIDDEN, INTERNAL_SERVER_ERROR } from '../../../http-status-codes';
import getKnex from '../../../server/db/connection-manager';

const knex = getKnex({});

function getReviewer(disclosureId, user) {
  return {
    userId: hashCode(user),
    disclosureId,
    name: user,
    email: 'test@test.com',
    title: 'Dean',
    unitName: 'Department of Psychology',
    assignedBy: 'Admin, COI'
  };
}

async function addReviewer(disclosureId, user) {
  const id = await knex('additional_reviewer').insert({
    disclosure_id: disclosureId,
    user_id: hashCode(user),
    name: user,
    email: 'test@test.com',
    active: true,
    dates: JSON.stringify([{
      type: DATE_TYPE.ASSIGNED,
      date: new Date(2016,0,0)
    }]),
    assigned_by: 'Admin, COI'
  },'id');
  return id[0];
}

let disclosureId;
describe('AdditionalReviewerControllerTest', () => {
  before(async function() {
    const disclosure = await knex('disclosure').insert({
      type_cd: DISCLOSURE_TYPE.ANNUAL,
      status_cd: DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL,
      user_id: 1234,
      start_date: new Date(),
      config_id: 1}, 'id');

    disclosureId = disclosure[0];
  });

  describe('POST /api/coi/additional-reviewers', () => {
    it('should only allow admins to add reviewers', async () => {
      await request(app.run())
        .post('/api/coi/additional-reviewers')
        .send(getReviewer(disclosureId, 'reviewerDeleteTest'))
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });

    it('should successfully add and return a reviewer with id',async () => {
      const response = await request(app.run())
        .post('/api/coi/additional-reviewers')
        .send(getReviewer(disclosureId, 'reviewerDeleteTest1'))
        .set('Authorization','Bearer admin')
        .expect(OK);

      const reviewer = response.body;
      assert(reviewer.id);
    });

    it('should return error if invalid data is provided',async () => {
      await request(app.run())
        .post('/api/coi/additional-reviewers')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /api/coi/additional-reviewers/:id', async () => {
    it('should not allow users to remove reviewers', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerDeleteTest2');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });

    it('should not allow reviewers to remove reviewers', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerDeleteTest3');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization','Bearer reviewerDeleteTest3')
        .expect(FORBIDDEN);
    });

    it('should allow admins to remove reviewers', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerDeleteTest4');
      await request(app.run())
        .del(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      const reviewers = await knex('additional_reviewer')
        .select('id')
        .where({id: reviewerId});

      assert.equal(reviewers.length,0);
    });
  });

  describe('PUT /api/coi/additional-reviewers/complete-review/:disclosureId', async () => {
    it('should not allow users to update current reviewer', async () => {
      await addReviewer(disclosureId,'reviewerUpdate1');
      await request(app.run())
        .put(`/api/coi/additional-reviewers/complete-review/${disclosureId}`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });

    it('should not allow admin to update current reviewer', async () => {
      await addReviewer(disclosureId,'reviewerUpdate2');
      await request(app.run())
        .put(`/api/coi/additional-reviewers/complete-review/${disclosureId}`)
        .set('Authorization','Bearer admin')
        .expect(FORBIDDEN);
    });

    it('should allow reviewers to update themselves', async () => {
      const reviewerId = await addReviewer(disclosureId,'reviewerUpdate3');
      await request(app.run())
        .put(`/api/coi/additional-reviewers/complete-review/${disclosureId}`)
        .set('Authorization','Bearer reviewerUpdate3')
        .expect(OK);

      const reviewers = await knex('additional_reviewer')
        .select('*')
        .where({id: reviewerId});

      const dates = JSON.parse(reviewers[0].dates);

      assert.equal(1,reviewers.length);
      assert.equal(0,reviewers[0].active);
      assert.equal(2,dates.length);
      assert.equal(DATE_TYPE.ASSIGNED,dates[0].type);
      assert.equal(DATE_TYPE.COMPLETED,dates[1].type);
    });
  });

  describe('PUT /api/coi/additional-reviewers/:id', async () => {
    let reviewerId;
    const now = new Date();
    before(async () => {
      reviewerId = await addReviewer(disclosureId,'reviewerUpdate985');
    });

    it('should not allow users to update', async () => {
      await request(app.run())
        .put(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });

    it('should not allow reviewers to update', async () => {
      await request(app.run())
        .put(`/api/coi/additional-reviewers/${reviewerId}`)
        .set('Authorization','Bearer reviewer')
        .expect(FORBIDDEN);
    });

    it('should allow admins to update', async () => {
      await request(app.run())
        .put(`/api/coi/additional-reviewers/${reviewerId}`)
        .send({
          active: true,
          dates: [
            {
              type: DATE_TYPE.ASSIGNED,
              date: now
            }
          ]

        })
        .set('Authorization','Bearer admin')
        .expect(OK);

      const reviewers = await knex('additional_reviewer')
        .select('*')
        .where({id: reviewerId});

      const dates = JSON.parse(reviewers[0].dates);
      assert.equal(1,reviewers.length);
      assert.equal(1,reviewers[0].active);
      assert.equal(1,dates.length);
      assert.equal(DATE_TYPE.ASSIGNED,dates[0].type);
      assert.equal(now.getMilliseconds(),new Date(dates[0].date).getMilliseconds());
    });
  });

  after(async function() {
    await knex('additional_reviewer').del();
    await knex('disclosure')
      .del()
      .where({id: disclosureId});
  });
});