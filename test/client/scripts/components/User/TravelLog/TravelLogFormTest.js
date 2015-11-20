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
import TravelLogForm from '../../../../../../client/scripts/components/User/TravelLog/TravelLogForm';
TravelLogForm.__Rewire__('TravelLogActions', MockTravelLogActions); //eslint-disable-line no-underscore-dangle
TravelLogForm.__Rewire__('TravelLogStore', MockTravelLogStore); //eslint-disable-line no-underscore-dangle

/*global describe, it */

const tree = sd.shallowRender(
  <TravelLogForm
    entry={{}}
    validating={true}
  />
);

const instance = tree.getMountedInstance();
const vdom = tree.getRenderOutput();

describe('TravelLogForm', () => {
  it('render form', () => {
    assert.equal('Travel Log Form', vdom.props.name);
  });

  it('render form with errors', () => {
    MockTravelLogActions.turnOnErrors(true);
    const form = sd.shallowRender(
      <TravelLogForm
        entry={{}}
        validating={true}
      />
    );

    const formDom = form.getRenderOutput();
    assert.equal('Travel Log Form', formDom.props.name);
  });

  it('updateField method', () => {
    instance.updateField({target: {value:'travelLogFormTest', id: 'travelLogFormTest'}});
    const storeState = MockTravelLogStore.getState();
    assert.equal('travelLogFormTest', storeState.updateLogValue);
  });

  it('updateStartDate method', () => {
    instance.updateStartDate('logStartDate');
    const storeState = MockTravelLogStore.getState();
    assert.equal('logStartDate', storeState.updateLogValue);
  });

  it('updateEndDate method', () => {
    instance.updateEndDate('logEndDate');
    const storeState = MockTravelLogStore.getState();
    assert.equal('logEndDate', storeState.updateLogValue);
  });

  it('addEntry method without errors', () => {
    MockTravelLogActions.turnOnErrors(false);
    instance.addEntry();

    const storeState = MockTravelLogStore.getState();
    assert.equal(true, storeState.entryAdded);
  });

  it('validateEntry method with errors', () => {
    MockTravelLogActions.turnOnErrors(true);
    instance.addEntry();

    const storeState = MockTravelLogStore.getState();
    assert.equal(true, storeState.validating);
  });



});
