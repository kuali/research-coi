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

import {AutoBindingStore} from './AutoBindingStore';
import {TravelLogActions} from '../actions/TravelLogActions.js';
import alt from '../alt';
import {processResponse, createRequest} from '../HttpUtils';

class _TravelLogStore extends AutoBindingStore {
  constructor() {
    super(TravelLogActions);

    this.entries = [];
    this.potentialEntry = {};
    this.sortColumn = 'name'
    this.sortDirection = 'ASCENDING'
  }



  refreshTravelLogEntries() {
    createRequest().get('/api/coi/travel-log-entries/')
    .query({sortColumn: this.sortColumn})
    .query({sortDirection: this.sortDirection})
    .end(processResponse((err, travelLog) => {
      if (!err) {
        this.entries = travelLog.body;
        this.emitChange();
      }
    }));
  }

  loadTravelLogEntries() {
    this.refreshTravelLogEntries();
  }

  sortColumnChanged(value) {
    this.sortColumn = value;
    this.refreshTravelLogEntries();
  }

  sortDirectionChanged(value) {
    this.sortDirection = value;
    this.refreshTravelLogEntries();
  }

  updateTravelLog(data) {
    this.potentialEntry[data.field] = data.value;
  }

  addEntry() {
    createRequest().post('/api/coi/travel-log-entries')
      .type('application/json')
      .send(this.potentialEntry)
      .end(processResponse((err, returnEntry) => {
        if (!err) {
          this.entries.push(returnEntry.body);
          this.potentialEntry = {};
          this.emitChange();
        }
      }));
  }


}

export let TravelLogStore = alt.createStore(_TravelLogStore, 'TravelLogStore');
