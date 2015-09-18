import alt from '../alt';

class _AdminActions {
  changeSort(newSortField) { this.dispatch(newSortField); }

  flipSortDirection() { this.dispatch(); }

  changeTypeFilter(newType) { this.dispatch(newType); }

  changeSearch(newSearch) { this.dispatch(newSearch); }

  doSearch() { this.dispatch(); }

  setStartDateFilter(newValue) { this.dispatch(newValue); }

  setEndDateFilter(newValue) { this.dispatch(newValue); }

  clearDateFilter() { this.dispatch(); }

  changeSubmittedByFilter(newFilter) { this.dispatch(newFilter); }

  changeReporterFilter(newFilter) { this.dispatch(newFilter); }

  toggleMobileFilters() { this.dispatch(); }

  loadDisclosure(id) { this.dispatch(id); }

  toggleApprovalConfirmation() { this.dispatch(); }

  toggleRejectionConfirmation() { this.dispatch(); }

  showProjectComments() { this.dispatch(); }

  showQuestionnaireComments() { this.dispatch(); }

  showEntitiesComments() { this.dispatch(); }

  hideProjectComments() { this.dispatch(); }

  hideQuestionnaireComments() { this.dispatch(); }

  hideEntitiesComments() { this.dispatch(); }

  clearTypeFilter() { this.dispatch(); }

  toggleTypeFilter(toToggle) { this.dispatch(toToggle); }

  clearStatusFilter() { this.dispatch(); }

  toggleStatusFilter(toToggle) { this.dispatch(toToggle); }

  setSortDirection(newDirection) { this.dispatch(newDirection); }

  loadMore() {
    this.dispatch();
  }
}

export let AdminActions = alt.createActions(_AdminActions);
