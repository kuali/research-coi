import {DisclosureActions} from '../actions/DisclosureActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import request from 'superagent';

class _DisclosureStore extends AutoBindingStore {
  constructor() {
    super (DisclosureActions);

    // initialize state here
    this.disclosures = [];

    this.applicationState = {
      archiveFilter: 'ALL'
    };

    this.archivedDisclosures = [];
  }

  refreshArchivedDisclosures() {
    request.get('/api/research/coi/disclosures/archived')
           .end((err, disclosures) => {
             if (!err) {
               this.archivedDisclosures = disclosures.body;
               this.emitChange();
             }
           });
  }

  loadArchivedDisclosures() {
    this.refreshArchivedDisclosures();
  }

  changeArchiveFilter(newValue) {
    this.applicationState.archiveFilter = newValue;
    this.refreshArchivedDisclosures();
  }
}

export let DisclosureStore = alt.createStore(_DisclosureStore, 'DisclosureStore');