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

import React from 'react'; //eslint-disable-line no-unused-vars
import assert from 'assert';
import sd from 'skin-deep';
import {MockTravelLogActions} from './mocks/MockTravelLogAction';
import {MockTravelLogStore} from './mocks/MockTravelLogStore';
import TravelLog from '../../../../../../client/scripts/components/User/TravelLog/TravelLog';
TravelLog.__Rewire__('TravelLogActions', MockTravelLogActions); //eslint-disable-line no-underscore-dangle
TravelLog.__Rewire__('TravelLogStore', MockTravelLogStore); //eslint-disable-line no-underscore-dangle

/*global describe, it */

describe('TravelLog', () => {
  it('render travel log with no entry state', () => {
    const tree = sd.shallowRender(
      <TravelLog/>
    );

    const vdom = tree.getRenderOutput();

    assert.equal('Travel Log', vdom.props.name);
  });

  it('render travel log with entry state', () => {
    MockTravelLogActions.updateEntryState(1);
    const tree = sd.shallowRender(
      <TravelLog/>
    );

    const vdom = tree.getRenderOutput();
    assert.equal('Travel Log', vdom.props.name);
  });

  it('componentDidMount and componentWillUnmount methods', () => {
    const tree = sd.shallowRender(
      <TravelLog/>
    );

    const instance = tree.getMountedInstance();

    let storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.entries.length);

    instance.componentDidMount();
    instance.componentWillUnmount();

    storeState = MockTravelLogStore.getState();
    assert.equal(2, storeState.entries.length);
  });
});
