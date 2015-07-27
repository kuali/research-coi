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
