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
import { allowedRoles } from '../../../server/middleware/role-check';

function getRequestWithRole(role) {
  return {
    originalUrl: '/api/some/endpoint',
    userInfo: {
      coiRole: role,
      username: 'testuser'
    }
  };
}

describe('role-check', () => {
  describe('allowedRoles', () => {
    it('should allow all through with ANY', () => {
      const middleware = allowedRoles('ANY');

      const res = {
        sendStatusCalled: false,
        code: 0,
        sendStatus(code) {
          this.sendStatusCalled = true;
          this.code = code;
          assert.fail('sendStatus shouldnt be called');
        }
      };

      let callCount = 0;
      middleware(getRequestWithRole('user'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 1);
      middleware(getRequestWithRole('admin'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 2);
      middleware(getRequestWithRole('bla'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 3);
    });

    it('should not allow anyone with an empty array', () => {
      const middleware = allowedRoles([]);

      const res = {
        sendStatusCalled: false,
        code: 0,
        sendStatus(code) {
          this.sendStatusCalled = true;
          this.code = code;
        }
      };

      middleware(getRequestWithRole('user'), res, () => {
        assert.fail('Next shouldnt be called');
      });
      assert(res.sendStatusCalled);
      res.sendStatusCalled = false;
      middleware(getRequestWithRole('admin'), res, () => {
        assert.fail('Next shouldnt be called');
      });
      assert(res.sendStatusCalled);
    });

    it('should allow the correct role through given a valid array', () => {
      const middleware = allowedRoles(['admin']);

      const res = {
        sendStatusCalled: false,
        code: 0,
        sendStatus(code) {
          this.sendStatusCalled = true;
          this.code = code;
          assert.fail('sendStatus shouldnt be called');
        }
      };

      let callCount = 0;
      middleware(getRequestWithRole('admin'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 1);
    });

    it('should not allow an incorrect role through given a valid array', () => {
      const middleware = allowedRoles(['admin']);

      const res = {
        sendStatusCalled: false,
        code: 0,
        sendStatus(code) {
          this.sendStatusCalled = true;
          this.code = code;
        }
      };

      let callCount = 0;
      middleware(getRequestWithRole('user'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 0);
      assert(res.sendStatusCalled);
    });

    it('should allow the correct role through given a valid string', () => {
      const middleware = allowedRoles('admin');

      const res = {
        sendStatusCalled: false,
        code: 0,
        sendStatus(code) {
          this.sendStatusCalled = true;
          this.code = code;
          assert.fail('sendStatus shouldnt be called');
        }
      };

      let callCount = 0;
      middleware(getRequestWithRole('admin'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 1);
    });

    it('should not allow an incorrect role through given a valid string', () => {
      const middleware = allowedRoles('admin');

      const res = {
        sendStatusCalled: false,
        code: 0,
        sendStatus(code) {
          this.sendStatusCalled = true;
          this.code = code;
        }
      };

      let callCount = 0;
      middleware(getRequestWithRole('user'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 0);
      assert(res.sendStatusCalled);
    });

    it('should not allow anyone with an empty string', () => {
      const middleware = allowedRoles('');

      const res = {
        sendStatusCalled: false,
        code: 0,
        sendStatus(code) {
          this.sendStatusCalled = true;
          this.code = code;
        }
      };

      let callCount = 0;
      middleware(getRequestWithRole('user'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 0);
      assert(res.sendStatusCalled);

      res.sendStatusCalled = false;
      middleware(getRequestWithRole('admin'), res, () => {
        callCount++;
      });
      assert.equal(callCount, 0);
      assert(res.sendStatusCalled);
    });
  });
});
