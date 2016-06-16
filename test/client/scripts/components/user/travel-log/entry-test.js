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

/* eslint-disable no-magic-numbers */

import React from 'react';
import assert from 'assert';
import sd from 'skin-deep';
import {MockTravelLogActions} from './mocks/mock-travel-log-action';
import {MockTravelLogStore} from './mocks/mock-travel-log-store';
import {COIConstants} from '../../../../../../coi-constants';
import Entry from '../../../../../../client/scripts/components/user/travel-log/entry';
Entry.__Rewire__('TravelLogActions', MockTravelLogActions); //eslint-disable-line no-underscore-dangle
Entry.__Rewire__('TravelLogStore', MockTravelLogStore); //eslint-disable-line no-underscore-dangle

/*global describe, it */

const relationshipId = 1;
const getTravelLog = () => {
  return {
    entityName: 'Dragon Cats',
    amount: 999,
    startDate: new Date(2015, 1, 1),
    endDate: new Date(2016, 1, 1),
    destination: 'fdssdf',
    reason: 'fdsffsdf',
    status: 'IN PROGRESS',
    disclosedDate: null,
    relationshipId,
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

  it('render disclosed entry viewer', () => {
    const travelLog = getTravelLog();
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

  it('saveEntry with errors', () => {
    const travelLog = getTravelLog();
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

    const storeState = MockTravelLogStore.getState();
    assert.equal(2, storeState.validatingId);
  });

  it('saveEntry without errors', () => {
    instance.saveEntry();

    const storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.saveId);
  });

  it('archiveEntry method', () => {
    instance.archiveEntry();

    const storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.archiveId);
  });

  it('editEntry method', () => {
    instance.editEntry();

    const storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.editId);
  });

  it('cancelEntry method', () => {
    instance.cancelEntry();

    const storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.cancelId);
  });

  it('deleteEntry method', () => {
    instance.deleteEntry();

    const storeState = MockTravelLogStore.getState();
    assert.equal(1, storeState.deleteId);
  });

  it('updateField method', () => {
    instance.updateField({target: {value: 'entityName', id: 'test'}});

    const storeState = MockTravelLogStore.getState();
    assert.equal('entityName', storeState.updateValue);
  });

  it('updateStartDate method', () => {
    instance.updateStartDate('startDate');

    const storeState = MockTravelLogStore.getState();
    assert.equal('startDate', storeState.updateValue);
  });

  it('updateEndDate method', () => {
    instance.updateEndDate('endDate');

    const storeState = MockTravelLogStore.getState();
    assert.equal('endDate', storeState.updateValue);
  });
});
