import alt from '../alt';
import request from 'superagent';

class _AdminActions {
  changeSort(newSortField) {
    this.dispatch(newSortField);
  }

  flipSortDirection() {
    this.dispatch();
  }

  changeTypeFilter(newType) {
    this.dispatch(newType);
  }

  changeQuery(newQuery) {
    this.dispatch(newQuery);
  }

  changeDateFilter(newFilter) {
    this.dispatch(newFilter);
  }

  changeDispositionFilter(newFilter) {
    this.dispatch(newFilter);
  }

  changeStatusFilter(newFilter) {
    this.dispatch(newFilter);
  }

  changeSubmittedByFilter(newFilter) {
    this.dispatch(newFilter);
  }

  changeReporterFilter(newFilter) {
    this.dispatch(newFilter);
  }

  toggleMobileFilters() {
    this.dispatch();
  }
}

export let AdminActions = alt.createActions(_AdminActions);