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
import { OK } from '../../../../http-status-codes';
import { DISCLOSURE_STATUS } from '../../../../coi-constants';
import {
  createDisclosure,
  insertDisclosure
} from '../../../test-utils';
import hashCode from '../../../../hash';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

describe('GET api/coi/pi', () => {
  before(async () => {
    const disclosureId1 = await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL), 'a1');
    await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL), 'a2');
    await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL), 'a3');
    await knex('additional_reviewer').insert({
      user_id: hashCode('reviewer1'),
      disclosure_id: disclosureId1,
      name: 'reviewer1',
      email: 'reviewer1@email.com'
    });
  });

  describe('test admin ', () => {
    let response;
    it('should return an OK status', async function() {
      response = await request(app.run())
        .get('/api/coi/pi')
        .query({term: 'a'})
        .set('Authorization', 'Bearer admin')
        .expect(OK);
    });

    it('should return all results', async function() {
      assert.equal(3, response.body.length);
    });
  });

  describe('test reviewer ', () => {
    let response;
    it('should return an OK status', async function() {
      response = await request(app.run())
        .get('/api/coi/pi')
        .query({term: 'a'})
        .set('Authorization', 'Bearer reviewer1')
        .expect(OK);
    });

    it('should return only one result', async function() {
      assert.equal(1, response.body.length);
      assert.equal('a1', response.body[0].value);
    });
  });

  after( async () => {
    await knex('additional_reviewer').del();
    await knex('disclosure').del();
  });
});
