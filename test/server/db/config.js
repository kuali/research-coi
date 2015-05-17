import assert from 'assert';
import * as Config from '../../../server/db/config';

describe('Config',() => {
  it('should get a config', () => {
    let config = Config.getConfigFor('MIT');
    assert.equal(config.colors.four, '#2BDEAD');
  });

  it('should save a config', () =>  {
    Config.setConfigFor('MIT', {frog: true, dog: false});
    let config = Config.getConfigFor('MIT');
    assert.equal(config.frog, true);
    assert.equal(config.dog, false);
  });

  it('should return undefined for a non existent school', () => {
    let config = Config.getConfigFor('Monsters University');
    assert.equal(config, undefined);
  });

  it('should save a schools config without affecting other schools configs', () => {
    Config.setConfigFor('CSU', {
      mascot: 'Rams'
    });

    Config.setConfigFor('UW', {
      mascot: 'Cowboys'
    });

    Config.setConfigFor('BYU', {
      mascot: 'Cougers'
    });

    let uw = Config.getConfigFor('UW');
    let csu = Config.getConfigFor('CSU');
    let byu = Config.getConfigFor('BYU');

    assert.equal(uw.mascot, 'Cowboys');
    assert.equal(csu.mascot, 'Rams');
    assert.equal(byu.mascot, 'Cougers');
  });
});