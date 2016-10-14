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
import {OK} from '../../../http-status-codes';
import configJSON from '../../client/config-context';
const config = configJSON.configState.config;

let previousConfig;

describe('ConfigController', () => {
  describe('saveConfig', () => {
    before(async function() {
      const response = await request(app.run())
        .get('/api/coi/config/')
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      previousConfig = response.body;
    });

    it('saves config', async function() {
      const response = await request(app.run())
        .post('/api/coi/config/')
        .send(config)
        .set('Authorization', 'Bearer admin')
        .expect(OK);

      assert.equal(config.matrixTypes.length, response.body.matrixTypes.length);
    });

    after(async function() {
      await request(app.run())
        .post('/api/coi/config/')
        .send(previousConfig)
        .set('Authorization', 'Bearer admin')
        .expect(OK);
    });
  });
});
