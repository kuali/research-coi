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

/*global describe, it */
import assert from 'assert';
import * as ConfigDB from '../../../server/db/ConfigDB';

describe('Config', () => {
  it('should get a config', () => {
    let config = ConfigDB.getConfigFor('UIT');
    assert.equal(config.colors.four, '#EDF2F2');
  });

  it('should save a config', () => {
    ConfigDB.setConfigFor('UIT', {frog: true, dog: false});
    let config = ConfigDB.getConfigFor('UIT');
    assert.equal(config.frog, true);
    assert.equal(config.dog, false);
  });

  it('should return undefined for a non existent school', () => {
    let config = ConfigDB.getConfigFor('Monsters University');
    assert.equal(config, undefined);
  });

  it('should save a schools config without affecting other schools configs', () => {
    ConfigDB.setConfigFor('CSU', {
      mascot: 'Rams'
    });

    ConfigDB.setConfigFor('UW', {
      mascot: 'Cowboys'
    });

    ConfigDB.setConfigFor('BYU', {
      mascot: 'Cougers'
    });

    let uw = ConfigDB.getConfigFor('UW');
    let csu = ConfigDB.getConfigFor('CSU');
    let byu = ConfigDB.getConfigFor('BYU');

    assert.equal(uw.mascot, 'Cowboys');
    assert.equal(csu.mascot, 'Rams');
    assert.equal(byu.mascot, 'Cougers');
  });

  it('should work in a case insensitive manner', () => {
    let upper = ConfigDB.getConfigFor('UIT');
    let lower = ConfigDB.getConfigFor('uit');
    assert.equal(lower, upper);
  });
});
