import alt from '../alt';

class DisclosureActions {
  doSomething(someParam) {
    this.dispatch(someParam);
  }
}

export default alt.createActions(DisclosureActions);