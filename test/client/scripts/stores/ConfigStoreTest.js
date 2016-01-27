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

/*global describe, it, beforeEach */
/* eslint-disable no-magic-numbers */
import alt from '../../../../client/scripts/alt';
import assert from 'assert';
import ConfigStore from '../../../../client/scripts/stores/ConfigStore';
import ConfigActions from '../../../../client/scripts/actions/ConfigActions';

const setState = (data) => {
  alt.dispatcher.dispatch({
    action: ConfigActions.SET_STATE_FOR_TEST, data
  });
};

describe('ConfigStore', () => {
  beforeEach(() => {
    alt.recycle(ConfigStore);
  });

  describe('setStateForTest', () => {
    it('should update state with values passed in', () => {
      setState({
        key: 'testStuff',
        value: true
      });
      const state = ConfigStore.getState();
      assert.equal(state.testStuff, true);
    });
  });

  describe('toggleAutoApprove', () => {
    const testToggleAutoApprove = (intial, expected) => {
      setState({
        key: 'config',
        value: {
          general: {
            autoApprove: intial
          }
        }
      });
      let state = ConfigStore.getState();

      assert.equal(state.config.general.autoApprove, intial);
      assert.equal(state.dirty, false);
      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE_AUTO_APPROVE,
        data: {}
      });

      state = ConfigStore.getState();
      assert.equal(state.config.general.autoApprove, expected);
      assert.equal(state.dirty, true);
    };

    it('should toggle value of autoApprove to true if undefined', () => {
      testToggleAutoApprove(undefined, true);
    });

    it('should toggle value of autoApprove to true if false', () => {
      testToggleAutoApprove(false, true);
    });

    it('should toggle value of autoApprove to false if true', () => {
      testToggleAutoApprove(true, false);
    });
  });
});
