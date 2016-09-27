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
  DISCLOSURE_STATUS,
  DISCLOSURE_TYPE,
  DISCLOSURE_STEP
} from '../../../coi-constants';
import hashCode from '../../../hash';
import { OK, FORBIDDEN} from '../../../http-status-codes';
import getKnex from '../../../server/db/connection-manager';

const knex = getKnex({});

describe('PIControllerTest', () => {
  let disclosureId;
  let piReviewId;
  let additionalReviewerId;
  const reviewer = 'reviewerPIControllerTest';
  const reviewerId = hashCode(reviewer);
  const user = 'PIControllerTest';
  const userId = hashCode(user);
  const today = new Date();

  before(async function() {
    const disclosure = await knex('disclosure').insert({
      type_cd: DISCLOSURE_TYPE.ANNUAL,
      status_cd: DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL,
      user_id: userId,
      start_date: today,
      config_id: 1}, 'id');

    disclosureId = disclosure[0];

    const piReview = await knex('pi_review').insert({
      disclosure_id: disclosureId,
      target_id: 1,
      target_type: DISCLOSURE_STEP.QUESTIONNAIRE
    }, 'id');

    piReviewId = piReview[0];

    const additionalReviewer = await knex('additional_reviewer').insert({
      disclosure_id: disclosureId,
      user_id: reviewerId,
      name: reviewer,
      email: 'test@test.com'
    },'id');

    additionalReviewerId = additionalReviewer[0];
  });

  describe('/api/coi/disclosures/:id/pi-responses', () => {
    it('admin should be able to retrieve any responses', async function () {
      const response = await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}/pi-responses`)
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      const review = response.body[0];
      assert.equal(review.targetId, 1);
      assert.equal(review.targetType, DISCLOSURE_STEP.QUESTIONNAIRE);
    });

    it('user should not be able to retrieve responses ', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}/pi-responses`)
        .set('Authorization', `Bearer ${user}`)
        .expect(FORBIDDEN);
    });

    it('reviewers should be able to retrieve responses for disclosures they are reviewers on ', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}/pi-responses`)
        .set('Authorization', `Bearer ${reviewer}`)
        .expect(OK);
    });

    it('reviewers should not be able to retrieve responses for disclosures they are not reviewers on ', async function () {
      await request(app.run())
        .get(`/api/coi/disclosures/${disclosureId}/pi-responses`)
        .set('Authorization', 'Bearer reviewer1234')
        .expect(FORBIDDEN);
    });
  });

  after(async function() {
    await knex('additional_reviewer')
      .del()
      .where({id: additionalReviewerId});
    await knex('pi_review')
      .del()
      .where({id: piReviewId});
    await knex('disclosure')
      .del()
      .where({id: disclosureId});
  });
});