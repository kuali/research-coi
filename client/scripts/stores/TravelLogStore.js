import {AutoBindingStore} from './AutoBindingStore';
import {TravelLogActions} from '../actions/TravelLogActions.js';
import alt from '../alt';
import {processResponse, createRequest} from '../HttpUtils';

class _TravelLogStore extends AutoBindingStore {
  constructor() {
    super(TravelLogActions);

    this.entries = [];
  }

  refreshTravelLogEntries() {
    createRequest().get('/api/coi/travelLogEntries/')
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
