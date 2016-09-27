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

import React from 'react';
import assert from 'assert';
import sd from 'skin-deep';
import {MockTravelLogActions} from './mocks/mock-travel-log-action';
import {MockTravelLogStore} from './mocks/mock-travel-log-store';
import TravelLogSort from '../../../../../../client/scripts/components/user/travel-log/travel-log-sort';
TravelLogSort.__Rewire__('TravelLogActions', MockTravelLogActions); //eslint-disable-line no-underscore-dangle

/*global describe, it */

const tree = sd.shallowRender(
  <TravelLogSort />
);

const instance = tree.getMountedInstance();
const vdom = tree.getRenderOutput();

describe('TravelLogSort', () => {
  it('render sort', () => {
    assert.equal('Travel Log Sort', vdom.props.name);
  });

  it('sortColumnChanged method', () => {
    instance.sortColumnChanged({target: {value: 'name'}});
    const storeState = MockTravelLogStore.getState();
    assert.equal('name', storeState.sortColumn);
  });

  it('sortDirectionChanged method', () => {
    instance.sortDirectionChanged({target: {value: 'DESC'}});
    const storeState = MockTravelLogStore.getState();
    assert.equal('DESC', storeState.sortDirection);
  });

  it('filterChanged method', () => {
    instance.filterChanged({target: {value: 'All'}});
    const storeState = MockTravelLogStore.getState();
    assert.equal('All', storeState.filter);
  });
});
