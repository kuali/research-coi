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

import assert from 'assert';
import {saveConfig} from '../../../server/controllers/config-controller';
import sinon from 'sinon';
import * as ConfigDB from '../../../server/db/config-d-b';
import Log from '../../../server/log';

let req;
let res;
let callback;
let config;
let archiveCalled;

sinon.stub(Log, 'error', () => {});

function stubSetConfig() {
  sinon.stub(ConfigDB, 'setConfig', (dbInfo, schoolId, newConfig) => {
    return new Promise(resolve => {
      config = newConfig;
      resolve();
    });
  });
}

function stubGetConfig() {
  sinon.stub(ConfigDB, 'getConfig', () => {
    return new Promise(resolve => {
      resolve(config);
    });
  });
}

function stubArchiveConfig() {
  sinon.stub(ConfigDB, 'archiveConfig', () => {
    return new Promise(resolve => {
      archiveCalled = true;
      resolve();
    });
  });
}

describe('ConfigController', () => {
  describe('saveConfig', () => {
    before(() => {
      stubSetConfig();
      stubArchiveConfig();
      stubGetConfig();
    });

    beforeEach(() => {
      req = {
        userInfo: {
          coiRole: 'admin'
        },
        body: {
          message: 'hello!'
        }
      };

      res = {
        sendStatus(statusCode) {
          this.status = statusCode;
          callback();
        },

        send(body) {
          this.body = body;
          callback();
        }
      };
      callback = () => {};
      config = undefined;
      archiveCalled = false;
    });

    it('saves config', done => {
      callback = () => {
        try {
          assert.equal(config, req.body);
          assert.equal(res.body, req.body);
          assert(archiveCalled);
          done();
        }
        catch (err) {
          done(err);
        }
      };

      saveConfig(req, res);
    });

    it('only admins can access', () => {
      req.userInfo.coiRole = 'user';
      saveConfig(req, res);
      assert.equal(res.status, 403);
      req.userInfo.coiRole = 'admin';
    });

    it('When error occurs it calls the next middleware with the error', done => {
      ConfigDB.getConfig.restore();
      sinon.stub(ConfigDB, 'getConfig', () => {
        return new Promise((resolve, reject) => {
          reject(new Error('really bad thing happened'));
        });
      });

      saveConfig(req, res, err => {
        ConfigDB.getConfig.restore();
        assert.equal(err.message, 'really bad thing happened');
        stubGetConfig();
        done();
      });
    });
  });
});
