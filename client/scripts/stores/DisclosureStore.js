import DisclosureActions from '../actions/DisclosureActions';
import alt from '../alt';

class DisclosureStore {
  constructor() {
    // initialize state here
    this.disclosures = [];

    this.bindListeners({
      handleSomethingBeingDone: DisclosureActions.DO_SOMETHING
    });
  }

  handleSomethingBeingDone(theParams) {
    this.disclosures = theParams;
  }
}

export default alt.createStore(DisclosureStore, 'DisclosureStore');