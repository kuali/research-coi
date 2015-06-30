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