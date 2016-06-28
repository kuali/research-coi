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
import {
  DISCLOSURE_TYPE,
  DISCLOSURE_STATUS,
  RELATIONSHIP_STATUS,
  FILE_TYPE
} from '../../../coi-constants';
import hashCode from '../../../hash';
import { OK, FORBIDDEN, ACCEPTED } from '../../../http-status-codes';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

async function addReviewer(disclosureId, user) {
  await knex('additional_reviewer').insert({
    disclosure_id: disclosureId,
    user_id: hashCode(user),
    name: user,
    email: 'test@test.com'
  },'id');
}

describe('FileController', () => {
  let disclosureId;
  let finEntityId;
  const user = 'FileControllerTest';
  const userId = hashCode(user);
  const today = new Date();

  before(async function() {
    const disclosure = await knex('disclosure').insert({
      type_cd: DISCLOSURE_TYPE.ANNUAL,
      status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
      user_id: userId,
      start_date: today,
      config_id: 1}, 'id');

    disclosureId = disclosure[0];

    const finEntity = await knex('fin_entity').insert({
      disclosure_id: disclosureId,
      status: RELATIONSHIP_STATUS.PENDING,
      active: true
    }, 'id');

    finEntityId = finEntity[0];
  });

  describe('/api/coi/files', () => {
    it('successfully uploads mulitiple files', async function() {
      const response = await request(app.run())
        .post('/api/coi/files')
        .attach('attachments','coi-constants.js')
        .attach('attachments','README.md')
        .field('data', JSON.stringify({
          refId: disclosureId,
          type: FILE_TYPE.MANAGEMENT_PLAN,
          disclosureId
        }))
        .set('Authorization','Bearer admin')
        .expect(OK);

      assert.equal(response.body.length, 2);
      assert.equal(response.body[0].userId,hashCode('admin'));
    });

    it('successfully uploads one file', async function() {
      const response = await request(app.run())
        .post('/api/coi/files')
        .attach('attachments','coi-constants.js')
        .field('data', JSON.stringify({
          refId: disclosureId,
          type: FILE_TYPE.DISCLOSURE,
          disclosureId
        }))
        .set('Authorization',`Bearer ${user}`)
        .expect(OK);

      assert.equal(response.body.length, 1);
      assert.equal(response.body[0].userId,userId);
    });

    it('should not allow user retrieve files that are not theirs', async function() {
      await request(app.run())
        .get('/api/coi/files/1')
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });

    it('should not allow user to retrieve file not in db', async function() {
      await request(app.run())
        .get('/api/coi/files/abc')
        .set('Authorization',`Bearer ${user}`)
        .expect(FORBIDDEN);
    });

    it('should allow user to retrieve files created by and admin if they are attached to there disclosure', async function() {
      const response = await request(app.run())
        .get('/api/coi/files/1')
        .set('Authorization',`Bearer ${user}`)
        .expect(OK);

      assert.equal(response.header['content-disposition'], 'attachment; filename="coi-constants.js"');
    });

    it('should allow admin to retrieve all files', async function() {
      const response = await request(app.run())
        .get('/api/coi/files/3')
        .set('Authorization','Bearer admin')
        .expect(OK);

      assert.equal(response.header['content-disposition'], 'attachment; filename="coi-constants.js"');
    });

    it('successfully retrieve files', async function() {
      const response = await request(app.run())
        .get('/api/coi/files/3')
        .set('Authorization',`Bearer ${user}`)
        .expect(OK);

      assert.equal(response.header['content-disposition'], 'attachment; filename="coi-constants.js"');
    });

    it('successfully delete files', async function() {
      await request(app.run())
        .delete('/api/coi/files/1')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);

      await request(app.run())
        .delete('/api/coi/files/2')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);

      await request(app.run())
        .delete('/api/coi/files/3')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);
    });

    after(async function() {
      await knex('file').truncate();
    });
  });

  describe('/api/coi/files/:fileType/:refId', () => {
    before(async function() {
      await request(app.run())
        .post('/api/coi/files')
        .attach('attachments','coi-constants.js')
        .attach('attachments','README.md')
        .field('data', JSON.stringify({
          refId: disclosureId,
          type: FILE_TYPE.MANAGEMENT_PLAN,
          disclosureId
        }))
        .set('Authorization','Bearer admin')
        .expect(OK);

      await request(app.run())
        .post('/api/coi/files')
        .attach('attachments','coi-constants.js')
        .attach('attachments','README.md')
        .field('data', JSON.stringify({
          refId: finEntityId,
          type: FILE_TYPE.FINANCIAL_ENTITY,
          disclosureId
        }))
        .set('Authorization','Bearer admin')
        .expect(OK);
    });

    it('admin should successfully get management plan zip file', async function() {
      const response = await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.MANAGEMENT_PLAN}/${disclosureId}`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      assert.equal(response.header['content-disposition'], `attachment; filename="${FILE_TYPE.MANAGEMENT_PLAN}.zip"`);
    });

    it('reviewer should not get management plan files if not assigned as reviewer', async function() {
      await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.MANAGEMENT_PLAN}/${disclosureId}`)
        .set('Authorization','Bearer reviewer')
        .expect(FORBIDDEN);
    });

    it('user should not get management plan files if they are not the user of the disclsoure', async function() {
      await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.MANAGEMENT_PLAN}/${disclosureId}`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });

    it('user should get management plan files if they are the user of the disclsoure', async function() {
      const response = await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.MANAGEMENT_PLAN}/${disclosureId}`)
        .set('Authorization',`Bearer ${user}`)
        .expect(OK);

      assert.equal(response.header['content-disposition'], `attachment; filename="${FILE_TYPE.MANAGEMENT_PLAN}.zip"`);
    });

    it('admin should successfully get fin entity zip file', async function() {
      const response = await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.FINANCIAL_ENTITY}/${finEntityId}`)
        .set('Authorization','Bearer admin')
        .expect(OK);

      assert.equal(response.header['content-disposition'], `attachment; filename="${FILE_TYPE.FINANCIAL_ENTITY}.zip"`);
    });

    it('reviewer should not get fin entity files if not assigned as reviewer', async function() {
      await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.FINANCIAL_ENTITY}/${finEntityId}`)
        .set('Authorization','Bearer reviewer')
        .expect(FORBIDDEN);
    });

    it('user should not get fin entity files if they are not the user of the disclsoure', async function() {
      await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.FINANCIAL_ENTITY}/${finEntityId}`)
        .set('Authorization','Bearer cate')
        .expect(FORBIDDEN);
    });

    it('user should get fin entity files if they are the user of the disclsoure', async function() {
      const response = await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.FINANCIAL_ENTITY}/${finEntityId}`)
        .set('Authorization',`Bearer ${user}`)
        .expect(OK);

      assert.equal(response.header['content-disposition'], `attachment; filename="${FILE_TYPE.FINANCIAL_ENTITY}.zip"`);
    });

    it('reviewer should get fin entity files if they are assigned as reviewer', async function() {
      await addReviewer(disclosureId, 'reviewer');
      await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.FINANCIAL_ENTITY}/${finEntityId}`)
        .set('Authorization','Bearer reviewer')
        .expect(OK);
    });

    it('reviewer should get fin entity files they are  assigned as reviewer', async function() {
      await request(app.run())
        .get(`/api/coi/files/${FILE_TYPE.FINANCIAL_ENTITY}/${finEntityId}`)
        .set('Authorization','Bearer reviewer')
        .expect(OK);
    });
    after(async function() {
      await request(app.run())
        .delete('/api/coi/files/1')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);

      await request(app.run())
        .delete('/api/coi/files/2')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);

      await request(app.run())
        .delete('/api/coi/files/3')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);

      await request(app.run())
        .delete('/api/coi/files/4')
        .send({})
        .set('Authorization','Bearer admin')
        .expect(ACCEPTED);
    });
  });

  after(async function() {
    await knex('file').truncate();
    await knex('additional_reviewer').del();
    await knex('fin_entity').del().where({disclosure_id: disclosureId});
    await knex('disclosure').del().where({id: disclosureId});
  });
});