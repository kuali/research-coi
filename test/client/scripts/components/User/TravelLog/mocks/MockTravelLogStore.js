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

import {AutoBindingStore} from '../../../../../../../client/scripts/stores/AutoBindingStore';
import {MockTravelLogActions} from './MockTravelLogAction.js';
import alt from '../../../../../../../client/scripts/alt';

class _MockTravelLogStore extends AutoBindingStore {
  constructor() {
    super(MockTravelLogActions);

    this.exportPublicMethods({
      getErrors: this.getErrors,
      getErrorsForId: this.getErrorsForId
    });

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

  updateEntry(data) {
    this.updateValue = data.value;
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
    } else {
      return {};
    }

  }

  getErrorsForId(relationshipId) {
    if (relationshipId === 1) {
      return {};
    } else {
      return {
        entityName: 'required',
        amount: 'required',
        destination: 'required',
        startDate: 'required',
        endDate: 'required',
        reason: 'required'
      };
    }
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

  updateTravelLog(data) {
    this.updateLogValue = data.value;
  }

  addEntry() {
    this.entryAdded = true;
  }

  turnOnValidations() {
    this.validating = true;
  }

}

export let MockTravelLogStore = alt.createStore(_MockTravelLogStore, 'MockTravelLogStore');
