import alt from '../alt';

class _DisclosureActions {
  changeArchiveFilter(newValue) {
    this.dispatch(newValue);
  }

  loadArchivedDisclosures() {
    this.dispatch();
  }
}

export let DisclosureActions = alt.createActions(_DisclosureActions);