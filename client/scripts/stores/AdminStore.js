import {AdminActions} from '../actions/AdminActions';
import alt from '../alt';
import request from 'superagent';

class _AdminStore {
  constructor() {
    // initialize state here
    this.applicationState = {
      sort: 'DATE_SUBMITTED',
      sortDirection: 'DESCENDING',
      query: '',
      filters: {
        date: undefined,
        type: undefined,
        disposition: undefined,
        status: undefined,
        submittedBy: undefined,
        reporterName: undefined
      },
      showFiltersOnMobile: false
    };

    this.disclosures = [];

    this.refreshDisclosures();

    this.bindListeners({
      changeSort: AdminActions.CHANGE_SORT,
      changeQuery: AdminActions.CHANGE_QUERY,
      flipSortDirection: AdminActions.FLIP_SORT_DIRECTION,
      changeDateFilter: AdminActions.CHANGE_DATE_FILTER,
      changeTypeFilter: AdminActions.CHANGE_TYPE_FILTER,
      changeDispositionFilter: AdminActions.CHANGE_DISPOSITION_FILTER,
      changeStatusFilter: AdminActions.CHANGE_STATUS_FILTER,
      changeSubmittedByFilter: AdminActions.CHANGE_SUBMITTED_BY_FILTER,
      changeReporterFilter: AdminActions.CHANGE_REPORTER_FILTER,
      toggleMobileFilters: AdminActions.TOGGLE_MOBILE_FILTERS
    });
  }

  refreshDisclosures() {
    request.get('/api/research/coi/disclosures')
           .query({sortColumn: this.applicationState.sort})
           .query({sortDirection: this.applicationState.sortDirection})
           .query({query: this.applicationState.query})
           .end((err, disclosures) => {
             if (!err) {
               this.disclosures = disclosures.body;
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

  changeDateFilter(newFilter) {
    this.applicationState.filters.date = newFilter;
  }

  changeDispositionFilter(newFilter) {
    this.applicationState.filters.disposition = newFilter;
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
}

export let AdminStore = alt.createStore(_AdminStore, 'AdminStore');