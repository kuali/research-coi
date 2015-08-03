import {AdminActions} from '../actions/AdminActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import request from 'superagent';

class _AdminStore extends AutoBindingStore {
  constructor() {
    super(AdminActions);

    // initialize state here
    this.applicationState = {
      sort: 'DATE_SUBMITTED',
      sortDirection: 'DESCENDING',
      query: '',
      filters: {
        date: {
          start: undefined,
          end: undefined
        },
        disposition: undefined,
        submittedBy: undefined,
        reporterName: undefined
      },
      showFiltersOnMobile: false,
      showingApproval: false,
      showingRejection: false,
      showingQuestionnaireComments: false,
      showingEntitiesComments: false,
      showingProjectComments: false,
      selectedDisclosure: undefined
    };

    this.clearTypeFilter();
    this.clearStatusFilter();

    this.disclosureSummaries = [];

    this.refreshDisclosures();
  }

  refreshDisclosures() {
    request.get('/api/coi/disclosure-summaries')
           .query({sortColumn: this.applicationState.sort})
           .query({sortDirection: this.applicationState.sortDirection})
           .query({query: this.applicationState.query})
           .end((err, summaries) => {
             if (!err) {
               this.disclosureSummaries = summaries.body;
               this.emitChange();
             }
           });
  }

  loadDisclosure(id) {
    request.get('/api/coi/disclosure/' + id)
           .end((err, disclosure) => {
             if (!err) {
               this.applicationState.selectedDisclosure = disclosure.body;
               this.emitChange();
             }
           });
  }

  changeSort(newSortField) {
    this.applicationState.sort = newSortField;
    this.applicationState.sortDirection = 'ASCENDING';
    this.refreshDisclosures();
    return false;
  }

  flipSortDirection() {
    if (this.applicationState.sortDirection === 'DESCENDING') {
      this.applicationState.sortDirection = 'ASCENDING';
    }
    else {
      this.applicationState.sortDirection = 'DESCENDING';
    }

    this.refreshDisclosures();
    return false;
  }

  setSortDirection(newDirection) {
    this.applicationState.sortDirection = newDirection;
  }

  changeQuery(newQuery) {
    let shouldRefresh = newQuery.length > 2 || this.applicationState.query.length > newQuery.length;
    this.applicationState.query = newQuery;
    if (shouldRefresh) {
      this.refreshDisclosures();
      return false;
    }
  }

  changeTypeFilter(newFilter) {
    this.applicationState.filters.type = newFilter;
  }

  setStartDateFilter(newValue) {
    this.applicationState.filters.date.start = newValue;
  }

  setEndDateFilter(newValue) {
    this.applicationState.filters.date.end = newValue;
  }

  clearDateFilter() {
    this.applicationState.filters.date.start = undefined;
    this.applicationState.filters.date.end = undefined;
  }

  changeStatusFilter(newFilter) {
    this.applicationState.filters.status = newFilter;
  }

  changeSubmittedByFilter(newFilter) {
    this.applicationState.filters.submittedBy = newFilter;
  }

  changeReporterFilter(newFilter) {
    this.applicationState.filters.reporterName = newFilter;
  }

  toggleMobileFilters() {
    this.applicationState.showFiltersOnMobile = !this.applicationState.showFiltersOnMobile;
  }

  toggleApprovalConfirmation() {
    this.applicationState.showingApproval = !this.applicationState.showingApproval;
  }

  toggleRejectionConfirmation() {
    this.applicationState.showingRejection = !this.applicationState.showingRejection;
  }

  showProjectComments() {
    this.applicationState.showingProjectComments = true;
  }

  showQuestionnaireComments() {
    this.applicationState.showingQuestionnaireComments = true;
  }

  showEntitiesComments() {
    this.applicationState.showingEntitiesComments = true;
  }

  hideProjectComments() {
    this.applicationState.showingProjectComments = false;
  }

  hideQuestionnaireComments() {
    this.applicationState.showingQuestionnaireComments = false;
  }

  hideEntitiesComments() {
    this.applicationState.showingEntitiesComments = false;
  }

  toggleProjectTypeFilter() {
    this.applicationState.filters.type.project = !this.applicationState.filters.type.project;
  }

  toggleAnnualTypeFilter() {
    this.applicationState.filters.type.annual = !this.applicationState.filters.type.annual;
  }

  clearTypeFilter() {
    this.applicationState.filters.type = {
      annual: true,
      project: true
    };
  }

  clearStatusFilter() {
    this.applicationState.filters.status = {
      inProgress: true,
      awaitingReview: true,
      revisionNecessary: true
    };
  }

  toggleInProgressStatusFilter() {
    this.applicationState.filters.status.inProgress = !this.applicationState.filters.status.inProgress;
  }

  toggleAwaitingReviewStatusFilter() {
    this.applicationState.filters.status.awaitingReview = !this.applicationState.filters.status.awaitingReview;
  }

  toggleRevisionNecessaryStatusFilter() {
    this.applicationState.filters.status.revisionNecessary = !this.applicationState.filters.status.revisionNecessary;
  }
}

export let AdminStore = alt.createStore(_AdminStore, 'AdminStore');
