import DisclosureActions from '../actions/DisclosureActions';
import alt from '../alt';

class DisclosureStore {
  constructor() {
    // initialize state here
    this.disclosures = [];

    this.bindListeners(DisclosureStore.getActionBindings());
  }

  static getActionBindings() {
    let bindings = {};
    for (let propName in AdminActions) {
      if (propName.charCodeAt(0) < 91) {
        let fixedName = propName.toLowerCase().replace(/_([a-z])/gi, function(s, group1) {
            return group1.toUpperCase();
        });
        bindings[fixedName] = AdminActions[propName];
      }
    }

    return bindings;
  }

  handleSomethingBeingDone(theParams) {
    this.disclosures = theParams;
  }
}

export default alt.createStore(DisclosureStore, 'DisclosureStore');