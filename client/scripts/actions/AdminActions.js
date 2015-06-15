import alt from '../alt';

class _AdminActions {
  changeSort(newSort, newSortDirection) {
    this.dispatch({
      sort: newSort, 
      direction: newSortDirection
    });
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