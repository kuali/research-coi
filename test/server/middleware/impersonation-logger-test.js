
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
import * as app from '../../../server/app';
import request from 'supertest';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

describe('impersonationLogger', async () => {
  it('should not insert a row in impersonation audit when not impersonation', async () => {
    await request(app.run())
      .post('/api/coi/impersonation-test1')
      .send({test: 'test'})
      .set('Authorization', 'Bearer test1');

    const record = await knex('impersonation_audit').select('*').where({path: '/api/coi/impersonation-test1'});
    assert.equal(0, record.length);
  });

  it('should insert a row in impersonation audit when impersonation', async () => {
    await request(app.run())
      .post('/api/coi/impersonation-test2')
      .send({test: 'test'})
      .set('Authorization', 'Bearer impersonating_test2');

    const record = await knex('impersonation_audit').select('*').where({path: '/api/coi/impersonation-test2'});
    assert.equal(1, record.length);
    assert.equal('test', JSON.parse(record[0].request_info).body.test);
  });

  after(async () => {
    await knex('impersonation_audit').del();
  });
});
