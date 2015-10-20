import {AutoBindingStore} from './AutoBindingStore';
import {TravelLogActions} from '../actions/TravelLogActions.js';
import alt from '../alt';
import request from 'superagent';
import {processResponse} from '../HttpUtils';
import cookies from 'cookies-js';

class _TravelLogStore extends AutoBindingStore {
  constructor() {
    super(TravelLogActions);

    this.entries = [];
  }

  refreshTravelLogEntries() {
    request.get('/api/coi/travelLogEntries/')
      .set('Authorization', 'Bearer ' + cookies.get('authToken'))
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

  addEntry(params) {
    this.entries.push({
      entityName: params.entityName,
      amount: params.amount,
      startDate: params.startDate,
      endDate: params.endDate,
      reason: params.reason,
      destination: params.destination
    });
  }

}

export let TravelLogStore = alt.createStore(_TravelLogStore, 'TravelLogStore');
