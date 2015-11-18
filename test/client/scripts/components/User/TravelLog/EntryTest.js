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

import React from 'react';
import TestUtils from 'react-addons-test-utils'
import assert from 'assert';
import rewire from 'rewire';
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

class MockParent extends React.Component {
  constructor() {
    super();

    this.state = {
      cancelId: 0,
      editId: 0,
      deleteId: 0,
      saveId: 0,
      updateId: 0,
      archiveId: 0,
      validatingId: 0
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MockTravelLogStore.listen(this.onChange);
  }

  componentWillUnmount() {
    MockTravelLogStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = MockTravelLogStore.getState();
    this.setState({
      cancelId: storeState.cancelId,
      editId: storeState.editId,
      deleteId: storeState.deleteId,
      saveId: storeState.saveId,
      archiveId: storeState.archiveId,
      validatingId: storeState.validatingId
    });
  }

  render() {
    return (
      <div>
        <Entry
          key={1}
          travelLog={this.props.travelLog}
          editing={this.props.editing}
          validating={this.props.validating}
        />
      </div>
    );
  }
}

let getTagByName = (component, tag, name) => {
  let elements = TestUtils.scryRenderedDOMComponentsWithTag(component, tag);
  return elements.find(element => {
    return element.getAttribute('name') === name;
  });
};

let getTagById = (component, tag, id) => {
  let elements = TestUtils.scryRenderedDOMComponentsWithTag(component, tag);
  return elements.find(element => {
    return element.getAttribute('id') === id;
  });
};

describe('Entry', () => {
  it('if not editing no inputs should be rendered', () => {
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={getTravelLog()} editing={false} validating={false}/>
    );

    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    assert.equal(0, inputs.length);
  });

  it('if editing inputs should be rendered', () => {
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={getTravelLog()} editing={true} validating={false}/>
    );

    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    assert.notEqual(0, inputs.length);
  });

  it('if archive button is clicked then store gets updated', () => {
    let travelLog = getTravelLog();
    travelLog.disclosedDate = new Date();
    travelLog.status = COIConstants.RELATIONSHIP_STATUS.DISCLOSED;

    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={travelLog} editing={false} validating={false}/>
    );

    let archive = getTagByName(component, 'button', 'Archive');
    TestUtils.Simulate.click(archive);
    assert.equal(1, component.state.archiveId);
  });

  it('if edit button is clicked then store gets updated', function() {
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={getTravelLog()} editing={false} validating={false}/>
    );

    let edit = getTagByName(component, 'button', 'Edit');
    TestUtils.Simulate.click(edit);
    assert.equal(1, component.state.editId);
  });

  it('if cancel button is clicked then store gets updated', function() {
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={getTravelLog()} editing={true} validating={false}/>
    );

    let cancel = getTagByName(component, 'button', 'Cancel');
    TestUtils.Simulate.click(cancel);
    assert.equal(1, component.state.cancelId);
  });

  it('if delete button is clicked then store gets updated', function() {
    let component = TestUtils.renderIntoDocument(
    <MockParent travelLog={getTravelLog()} editing={false} validating={false}/>
    );

    let del = getTagByName(component, 'button', 'Delete');
    TestUtils.Simulate.click(del);
    assert.equal(1, component.state.deleteId);
  });

  it('if done button is clicked then store gets updated', function() {
    let component = TestUtils.renderIntoDocument(
    <MockParent travelLog={getTravelLog()} editing={true} validating={false}/>
    );

    let done = getTagByName(component, 'button', 'Done');
    TestUtils.Simulate.click(done);
    assert.equal(1, component.state.saveId);
  });

  it('if done button is clicked and errors are present then store gets updated', function() {
    let travelLog = getTravelLog();
    travelLog.relationshipId = 2;
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={travelLog} editing={true} validating={false}/>
    );

    let done = getTagByName(component, 'button', 'Done');
    TestUtils.Simulate.click(done);
    assert.equal(2, component.state.validatingId);
  });

  it('if field is updated store gets updated', function() {
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={getTravelLog()} editing={true} validating={false}/>
    );

    let entityName = getTagByName(component, 'input', 'Entity Name');
    TestUtils.Simulate.change(entityName, {target: {id: 'entityName', value: 'Panda Dogs'}});
    assert.equal(1, component.state.editId);
  });

  it('if start date is updated store gets updated', function() {
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={getTravelLog()} editing={true} validating={false}/>
    );

    let startDate = getTagById(component, 'input', 'startDate');
    TestUtils.Simulate.click(startDate);

    let days = TestUtils.scryRenderedDOMComponentsWithClass(component, 'DayPicker-Day');
    let dayClick = days.filter(day=> {
      return day.innerHTML === '15';
    });
    TestUtils.Simulate.click(dayClick[0]);
    assert.equal(1, component.state.editId);
  });

  it('if end date is updated store gets updated', function() {
    let component = TestUtils.renderIntoDocument(
      <MockParent travelLog={getTravelLog()} editing={true} validating={false}/>
    );

    let endDate = getTagById(component, 'input', 'endDate');
    TestUtils.Simulate.click(endDate);

    let days = TestUtils.scryRenderedDOMComponentsWithClass(component, 'DayPicker-Day');
    let dayClick = days.filter(day=> {
      return day.innerHTML === '15';
    });
    TestUtils.Simulate.click(dayClick[1]);
    assert.equal(1, component.state.editId);
  });

});
