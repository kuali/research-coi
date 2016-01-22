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
let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/ConnectionManager').default;
}
const knex = getKnex({});

describe('FileController', () => {

  before(async function(){
    const disclosure = await knex('disclosure').select('id').where({id:1});
    if (!disclosure[0]) {
      await knex('disclosure').insert({
        id: 1,
        type_cd: 2,
        status_cd: 1,
        user_id:-1291059799,
        start_date: new Date(),
        config_id: 1});
    } else {
      await knex('disclosure').update({
        user_id: -1291059799
      }).where({id: 1});
    }
  });

  it('successfully uploads mulitiple files', async function() {
    const response = await request(app.run())
      .post('/api/coi/files')
      .attach('attachments','COIConstants.js')
      .attach('attachments','README.md')
      .field('data', JSON.stringify({
        refId: 1,
        type: COIConstants.FILE_TYPE.MANAGEMENT_PLAN,
        disclosureId: 1
      }))
      .set('Authorization','Bearer admin')
      .expect(200);

    assert.equal(response.body.length, 2);
    assert.equal(response.body[0].user_id,92668751);

  });

  it('successfully uploads one file', async function() {
    const response = await request(app.run())
      .post('/api/coi/files')
      .attach('attachments','COIConstants.js')
      .field('data', JSON.stringify({
        refId: 1,
        type: COIConstants.FILE_TYPE.DISCLOSURE,
        disclosureId: 1
      }))
      .set('Authorization','Bearer jtester')
      .expect(200);

    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].user_id,-1291059799);
  });

  it('should not allow user retrieve files that are not theirs', async function() {
    await request(app.run())
      .get('/api/coi/files/1')
      .set('Authorization','Bearer cate')
      .expect(403);
  });

  it('should not allow user to retrieve file not in db', async function() {
    await request(app.run())
      .get('/api/coi/files/abc')
      .set('Authorization','Bearer cate')
      .expect(403);
  });

  it('should allow user to retrieve files created by and admin if they are attached to there disclosure', async function() {
    const response = await request(app.run())
      .get('/api/coi/files/1')
      .set('Authorization','Bearer jtester')
      .expect(200);

    assert.equal(response.header['content-disposition'], 'attachment; filename="COIConstants.js"');
  });

  it('should allow admin to retrieve all files', async function() {
    const response = await request(app.run())
      .get('/api/coi/files/3')
      .set('Authorization','Bearer admin')
      .expect(200);

    assert.equal(response.header['content-disposition'], 'attachment; filename="COIConstants.js"');
  });

  it('successfully retrieve files', async function() {
    const response = await request(app.run())
      .get('/api/coi/files/3')
      .set('Authorization','Bearer jtester')
      .expect(200);

    assert.equal(response.header['content-disposition'], 'attachment; filename="COIConstants.js"');
  });

  it('successfully delete files', async function() {
    await request(app.run())
      .delete('/api/coi/files/1')
      .send({})
      .set('Authorization','Bearer admin')
      .expect(202);

    await request(app.run())
      .delete('/api/coi/files/2')
      .send({})
      .set('Authorization','Bearer admin')
      .expect(202);

    await request(app.run())
      .delete('/api/coi/files/3')
      .send({})
      .set('Authorization','Bearer admin')
      .expect(202);
  });

  after(async function() {
    await knex('file').truncate();
  });
});