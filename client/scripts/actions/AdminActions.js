import alt from '../alt';
import request from 'superagent';

class _AdminActions {
  changeSort(newSortField) {this.dispatch(newSortField);}

  flipSortDirection() {this.dispatch();}

  changeTypeFilter(newType) {this.dispatch(newType);}

  changeQuery(newQuery) {this.dispatch(newQuery);}

  setStartDateFilter(newValue) {this.dispatch(newValue);}

  setEndDateFilter(newValue) {this.dispatch(newValue);}

  clearDateFilter() {this.dispatch();}

  changeStatusFilter(newFilter) {this.dispatch(newFilter);}

  changeSubmittedByFilter(newFilter) {this.dispatch(newFilter);}

  changeReporterFilter(newFilter) {this.dispatch(newFilter);}

  toggleMobileFilters() {this.dispatch();}

  loadDisclosure(id) {this.dispatch(id);}

  toggleApprovalConfirmation() {this.dispatch();}

  toggleRejectionConfirmation() {this.dispatch();}

  showProjectComments() {this.dispatch();}

  showQuestionnaireComments() {this.dispatch();}

  showEntitiesComments() {this.dispatch();}

  hideProjectComments() {this.dispatch();}

  hideQuestionnaireComments() {this.dispatch();}

  hideEntitiesComments() {this.dispatch();}

  toggleAnnualTypeFilter() {this.dispatch();}

  toggleProjectTypeFilter() {this.dispatch();}

  clearTypeFilter() {this.dispatch();}

  clearStatusFilter() {this.dispatch();}

  toggleInProgressStatusFilter() {this.dispatch();}

  toggleAwaitingReviewStatusFilter() {this.dispatch();}

  toggleRevisionNecessaryStatusFilter() {this.dispatch();}

  setSortDirection(newDirection) {this.dispatch(newDirection);}
}

export let AdminActions = alt.createActions(_AdminActions);