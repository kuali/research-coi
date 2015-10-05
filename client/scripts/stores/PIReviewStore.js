import PIReviewActions from '../actions/PIReviewActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import request from 'superagent';
import {COIConstants} from '../../../COIConstants';

class _PIReviewStore extends AutoBindingStore {
  constructor() {
    super(PIReviewActions);

    this.exportPublicMethods({
    });

    this.applicationState = {
    };
  }

  loadDisclosure(disclosureId) {
    request.get('/api/coi/disclosure/' + disclosureId + '/pi-review-items')
           .end((err, disclosure) => {
             if (!err) {
               this.disclosure = disclosure.body;
               this.emitChange();
             }
           });
  }
}

export let PIReviewStore = alt.createStore(_PIReviewStore, 'PIReviewStore');
