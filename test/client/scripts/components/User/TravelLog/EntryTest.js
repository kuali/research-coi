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

/* eslint-disable no-magic-numbers */

import React from 'react'; //eslint-disable-line no-unused-vars
import assert from 'assert';
import sd from 'skin-deep';
import {MockTravelLogActions} from './mocks/MockTravelLogAction';
import {MockTravelLogStore} from './mocks/MockTravelLogStore';
import {COIConstants} from '../../../../../../COIConstants';
import Entry from '../../../../../../client/scripts/components/User/TravelLog/Entry';
Entry.__Rewire__('TravelLogActions', MockTravelLogActions); //eslint-disable-line no-underscore-dangle
Entry.__Rewire__('TravelLogStore', MockTravelLogStore); //eslint-disable-line no-underscore-dangle

/*global describe, it */

let relationshipId = 1;
let getTravelLog = () => {
  return {
    entityName: 'Dragon Cats',
    amount: 999,
    startDate: new Date(2015, 1, 1),
    endDate: new Date(2016, 1, 1),
    destination: 'fdssdf',
    reason: 'fdsffsdf',
    status: 'IN PROGRESS',
    disclosedDate: null,
    relationshipId: relationshipId,
    active: 1
  };
};

const tree = sd.shallowRender(
  <Entry
    key={1}
    travelLog={getTravelLog()}
    editing={true}
    validating={false}
  />
);

const instance = tree.getMountedInstance();
const vdom = tree.getRenderOutput();

describe('Entry', () => {
  it('render entry viewer', () => {
    const entry = sd.shallowRender(
      <Entry
        key={1}
        travelLog={getTravelLog()}
        editing={false}
        validating={false}
      />
    );

    const entryDom = entry.getRenderOutput();
    assert.equal('Entry Viewer', entryDom.props.children.props.name);
  });

  it('render disclosed entry viewer', function() {
    let travelLog = getTravelLog();
    travelLog.status = COIConstants.RELATIONSHIP_STATUS.DISCLOSED;
    travelLog.disclosedDate = new Date();
    const entry = sd.shallowRender(
      <Entry
        key={1}
        travelLog={travelLog}
        editing={false}
        validating={false}
      />
    );

    const entryDom = entry.getRenderOutput();
    assert.equal('Entry Viewer', entryDom.props.children.props.name);
  });

  it('render entry editor', () => {
    assert.equal('Entry Editor', vdom.props.children.props.name);
  });

  it('saveEntry with errors', function() {
    let travelLog = getTravelLog();
    travelLog.relationshipId = 2;
    const entry = sd.shallowRender(
      <Entry
        key={1}
        travelLog={travelLog}
        editing={true}
        validating={true}
      />
    );

    const entryInstance = entry.getMountedInstance();
    entryInstance.saveEntry();

    let storeState = MockTravelLogStore.getState();
    assert.equal(2, storeState.validatingId);
  });

  it('saveEntry without errors', function() {
    instance.saveEntry();

    let storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.saveId);
  });

  it('archiveEntry method', () => {
    instance.archiveEntry();

    let storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.archiveId);
  });

  it('editEntry method', function() {
    instance.editEntry();

    let storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.editId);
  });

  it('cancelEntry method', function() {
    instance.cancelEntry();

    let storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.cancelId);
  });

  it('deleteEntry method', function() {
    instance.deleteEntry();

    let storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.deleteId);
  });

  it('updateField method', function() {
    instance.updateField({target: {value: 'entityName', id: 'test'}});

    let storeState = MockTravelLogStore.getState();
    assert.equal('entityName', storeState.updateValue);
  });

  it('updateStartDate method', function() {
    instance.updateStartDate('startDate');

    let storeState = MockTravelLogStore.getState();
    assert.equal('startDate', storeState.updateValue);
  });

  it('updateEndDate method', function() {
    instance.updateEndDate('endDate');

    let storeState = MockTravelLogStore.getState();
    assert.equal('endDate', storeState.updateValue);
  });

});
