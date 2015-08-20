import {AutoBindingStore} from './AutoBindingStore';
import {TravelLogActions} from '../actions/TravelLogActions.js';
import alt from '../alt';

class _TravelLogStore extends AutoBindingStore {
    constructor() {
      super(TravelLogActions);

      this.entries = [{entityName: 'Johnson & Johnson',
            amount: 2045.34,
            startDate: '05/15/2015',
            endDate: '05/20/2015',
            reason: 'I was a keynote speaker at their big big conference.',
            destination: 'Lehi, UT.'}];
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
