import {AdminActions} from '../actions/AdminActions';
import alt from '../alt';

class _AdminStore {
  constructor() {
    // initialize state here
    this.applicationState = {
      sort: 'DATE_SUBMITTED',
      sortDirection: 'ASCENDING',
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

    this.disclosures = [{
      disposition: 222,
      id: 34324234,
      name: 'Research 1',
      submittedBy: 'John Jack',
      submittedOn: 1434148767062,
      status: 'Ready',
      projects: [{
        'name': 'Project 1'
      }]
    }, 
    {
      disposition: 222,
      id: 32432,
      name: 'Research 2',
      submittedBy: 'Kim Kiera',
      submittedOn: 1434148767062,
      status: 'Open',
      projects: [{
        'name': 'Project 1'
      }]
    }, 
    {
      disposition: 222,
      id: 54364,
      name: 'Research 3',
      submittedBy: 'Lara Lant',
      submittedOn: 1434148767062,
      status: 'Open',
      projects: [{
        'name': 'Project 1'
      }]
    }, 
    {
      disposition: 222,
      id: 76576,
      name: 'Research 4',
      submittedBy: 'Mark Millburn',
      submittedOn: 1434148767062,
      status: 'Open',
      projects: [{
        'name': 'Project 1'
      }]
    }, 
    {
      disposition: 222,
      id: 9769,
      name: 'Research 5',
      submittedBy: 'Nate Niter',
      submittedOn: 1434148767062,
      status: 'Open',
      projects: [{
        'name': 'Project 1'
      }]
    }, 
    {
      disposition: 222,
      id: 8987,
      name: 'Research 6',
      submittedBy: 'Oliver Osmond',
      submittedOn: 1434148767062,
      status: 'Open',
      projects: [{
        'name': 'Project 1'
      }]
    }, 
    {
      disposition: 222,
      id: 113232,
      name: 'Research 7',
      submittedBy: 'Peter Pratan',
      submittedOn: 1434148767062,
      status: 'Open',
      projects: [{
        'name': 'Project 1'
      }]
    }];

    this.bindListeners({
      changeSort: AdminActions.CHANGE_SORT,
      changeDateFilter: AdminActions.CHANGE_DATE_FILTER,
      changeTypeFilter: AdminActions.CHANGE_TYPE_FILTER,
      changeDispositionFilter: AdminActions.CHANGE_DISPOSITION_FILTER,
      changeStatusFilter: AdminActions.CHANGE_STATUS_FILTER,
      changeSubmittedByFilter: AdminActions.CHANGE_SUBMITTED_BY_FILTER,
      changeReporterFilter: AdminActions.CHANGE_REPORTER_FILTER,
      toggleMobileFilters: AdminActions.TOGGLE_MOBILE_FILTERS
    });
  }

  changeSort(newValue) {
    this.applicationState.sort = newValue.sort;
    this.applicationState.sortDirection = newValue.direction;
  }

  changeQuery(newQuery) {
    this.applicationState.query = newQuery;
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