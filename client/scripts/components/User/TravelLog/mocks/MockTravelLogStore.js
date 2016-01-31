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

import {MockTravelLogActions} from './MockTravelLogAction.js';
import alt from '../../../../../../../client/scripts/alt';

class _MockTravelLogStore {
  constructor() {
    this.bindActions(MockTravelLogActions);

    this.exportPublicMethods({
      getErrors: this.getErrors,
      getErrorsForId: this.getErrorsForId
    });

    this.entries = [{
      entityName: 'Dragon Cats',
      amount: 999,
      startDate: new Date(2015, 1, 1),
      endDate: new Date(2016, 1, 1),
      destination: 'fdssdf',
      reason: 'fdsffsdf',
      status: 'IN PROGRESS',
      disclosedDate: null,
      relationshipId: 1,
      active: 1
    }];
    this.entryStates = {};
    this.cancelId = 0;
    this.editId = 0;
    this.deleteId = 0;
    this.updateValue = '';
    this.saveId = 0;
    this.archiveId = 0;
    this.validatingId = 0;
    this.updateLogValue = '';
    this.entryAdded = false;
    this.validating = false;
    this.errors = false;
    this.sortColumn = '';
    this.sortDirection = '';
    this.filter = '';
  }

  loadTravelLogEntries() {
    this.entries.push({
      entityName: 'Panda Dogs',
      amount: 999,
      startDate: new Date(2015, 1, 1),
      endDate: new Date(2016, 1, 1),
      destination: 'fdssdf',
      reason: 'fdsffsdf',
      status: 'IN PROGRESS',
      disclosedDate: null,
      relationshipId: 2,
      active: 1
    });
  }

  editEntry(relationshipId) {
    this.editId = relationshipId;
  }

  saveEntry(relationshipId) {
    this.saveId = relationshipId;
  }

  cancelEntry(relationshipId) {
    this.cancelId = relationshipId;
  }

  updateEntry([,value]) {
    this.updateValue = value;
  }

  turnOnValidationsForEntry(relationshipId) {
    this.validatingId = relationshipId;
  }

  getErrors() {
    const storeState = this.getState();
    if (storeState.errors === true) {
      return {
        entityName: 'required',
        amount: 'required',
        destination: 'required',
        startDate: 'required',
        endDate: 'required',
        reason: 'required'
      };
    }

    return {};
  }

  getErrorsForId(relationshipId) {
    if (relationshipId === 1) {
      return {};
    }

    return {
      entityName: 'required',
      amount: 'required',
      destination: 'required',
      startDate: 'required',
      endDate: 'required',
      reason: 'required'
    };
  }

  turnOnErrors(value) {
    this.errors = value;
  }

  deleteEntry(relationshipId) {
    this.deleteId = relationshipId;
  }

  archiveEntry(relationshipId) {
    this.archiveId = relationshipId;
  }

  updateTravelLog([, value]) {
    this.updateLogValue = value;
  }

  addEntry() {
    this.entryAdded = true;
  }

  turnOnValidations() {
    this.validating = true;
  }

  sortColumnChanged(value) {
    this.sortColumn = value;
  }

  sortDirectionChanged(value) {
    this.sortDirection = value;
  }

  filterChanged(value) {
    this.filter = value;
  }

  updateEntryState(relationshipId) {
    this.entryStates[relationshipId] = {};
    this.entryStates[relationshipId].editing = true;
    this.entryStates[relationshipId].validating = true;
  }
}

export const MockTravelLogStore = alt.createStore(_MockTravelLogStore, 'MockTravelLogStore');
