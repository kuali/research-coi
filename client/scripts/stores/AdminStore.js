import {AdminActions} from '../actions/AdminActions';
import {AutoBindingStore} from './AutoBindingStore';
import {COIConstants} from '../../../COIConstants';
import alt from '../alt';
import {processResponse, createRequest} from '../HttpUtils';

const PAGE_SIZE = 40;

class _AdminStore extends AutoBindingStore {
  constructor() {
    super(AdminActions);

    // initialize state here
    this.applicationState = {
      sort: 'SUBMITTED_DATE',
      sortDirection: 'ASCENDING',
      filters: {
        date: {
          start: undefined,
          end: undefined
        },
        submittedBy: undefined,
        status: [2, 4, 5, 6],
        type: [],
        search: ''
      },
      effectiveSearchValue: '',
      showFiltersOnMobile: false,
      showingApproval: false,
      showingRejection: false,
      selectedDisclosure: undefined,
      loadingMore: false,
      offset: 0,
      loadedAll: false,
      summaryCount: 0,
      listShowing: true,
      commentingPanelShowing: false,
      additionalReviewShowing: false,
      commentSummaryShowing: false
    };

    this.disclosureSummaries = [];

    this.refreshDisclosures();
  }

  morePossibleSummaries(summaries) {
    return summaries.length !== 0 && summaries.length % PAGE_SIZE === 0;
  }

  loadSummaryCount() {
    createRequest().get('/api/coi/disclosure-summaries/count')
           .query({filters: encodeURIComponent(JSON.stringify(this.applicationState.filters))})
           .end(processResponse((err, theCount) => {
             if (!err) {
               this.applicationState.summaryCount = theCount.body[0].rowcount;
               this.applicationState.loadedAll = this.disclosureSummaries.length === this.applicationState.summaryCount;
               this.emitChange();
             }
           }));
  }

  refreshDisclosures() {
    this.applicationState.offset = 0;
    this.applicationState.loadingMore = true;

    createRequest().get('/api/coi/disclosure-summaries')
           .query({sortColumn: this.applicationState.sort})
           .query({sortDirection: this.applicationState.sortDirection})
           .query({filters: encodeURIComponent(JSON.stringify(this.applicationState.filters))})
           .query({start: this.applicationState.offset})
           .end(processResponse((err, summaries) => {
             if (!err) {
               this.disclosureSummaries = summaries.body;
               this.applicationState.loadingMore = false;
               if (this.morePossibleSummaries(this.disclosureSummaries)) {
                 this.loadSummaryCount();
               }
               else {
                 this.applicationState.summaryCount = this.disclosureSummaries.length;
                 this.applicationState.loadedAll = true;
               }

               this.emitChange();
             }
           }));
  }

  loadDisclosure(id) {
    createRequest().get('/api/coi/disclosures/' + id)
      .end(processResponse((err, disclosure) => {
        if (!err) {
          this.applicationState.selectedDisclosure = disclosure.body;
          this.emitChange();
        }
      }));

    createRequest().get(`/api/coi/disclosures/${id}/pi-responses`)
      .end(processResponse((err, responses) => {
        if (!err) {
          this.applicationState.piResponses = responses.body;
          this.emitChange();
        }
      }));
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

  changeSearch(newSearch) {
    let shouldRefresh = newSearch.length > 2 || this.applicationState.filters.search.length > newSearch.length;
    this.applicationState.filters.search = newSearch;
    if (shouldRefresh) {
      this.applicationState.effectiveSearchValue = newSearch;
      this.refreshDisclosures();
      return false;
    }
  }

  doSearch() {
    this.applicationState.effectiveSearchValue = this.applicationState.filters.search;
    this.refreshDisclosures();
  }

  changeTypeFilter(newFilter) {
    this.applicationState.filters.type = newFilter;
  }

  setStartDateFilter(newValue) {
    this.applicationState.filters.date.start = newValue;
    this.refreshDisclosures();
  }

  setEndDateFilter(newValue) {
    this.applicationState.filters.date.end = newValue;
    this.refreshDisclosures();
  }

  clearDateFilter() {
    this.applicationState.filters.date.start = undefined;
    this.applicationState.filters.date.end = undefined;
    this.refreshDisclosures();
  }

  clearSubmittedByFilter() {
    this.applicationState.filters.submittedBy = undefined;
    this.refreshDisclosures();
  }

  setSubmittedByFilter(name) {
    this.applicationState.filters.submittedBy = name;
    this.refreshDisclosures();
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

  approveDisclosure() {
    createRequest().put('/api/coi/disclosures/' + this.applicationState.selectedDisclosure.id + '/approve')
    .send(this.applicationState.selectedDisclosure)
    .type('application/json')
    .end(processResponse(err => {
      if (!err) {
        this.applicationState.selectedDisclosure.statusCd = COIConstants.DISCLOSURE_STATUS.UP_TO_DATE;
        this.applicationState.showingApproval = !this.applicationState.showingApproval;
        this.emitChange();
      }
    }));
  }

  toggleRejectionConfirmation() {
    this.applicationState.showingRejection = !this.applicationState.showingRejection;
  }

  rejectDisclosure() {
    createRequest().put('/api/coi/disclosures/' + this.applicationState.selectedDisclosure.id + '/reject')
    .end(processResponse(err => {
      if (!err) {
        this.applicationState.selectedDisclosure.statusCd = COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED;
        this.applicationState.showingRejection = !this.applicationState.showingRejection;
        this.emitChange();
      }
    }));
  }

  clearTypeFilter() {
    this.applicationState.filters.type = [];
    this.refreshDisclosures();
  }

  toggleTypeFilter(toToggle) {
    let index = this.applicationState.filters.type.findIndex(filter => {
      return filter === toToggle;
    });
    if (index === -1) {
      this.applicationState.filters.type.push(toToggle);
    }
    else {
      this.applicationState.filters.type.splice(index, 1);
    }

    this.refreshDisclosures();
  }

  clearStatusFilter() {
    this.applicationState.filters.status = [];
    this.refreshDisclosures();
  }

  toggleStatusFilter(toToggle) {
    let index = this.applicationState.filters.status.findIndex(filter => {
      return filter === toToggle.code;
    });
    if (index === -1) {
      this.applicationState.filters.status.push(toToggle.code);
    }
    else {
      this.applicationState.filters.status.splice(index, 1);
    }

    this.refreshDisclosures();
  }

  loadMore() {
    if (this.applicationState.loadedAll) {
      return false;
    }

    this.applicationState.loadingMore = true;
    this.applicationState.offset += PAGE_SIZE;

    createRequest().get('/api/coi/disclosure-summaries')
           .query({sortColumn: this.applicationState.sort})
           .query({sortDirection: this.applicationState.sortDirection})
           .query({filters: encodeURIComponent(JSON.stringify(this.applicationState.filters))})
           .query({start: this.applicationState.offset})
           .end(processResponse((err, summaries) => {
             if (!err) {
               this.disclosureSummaries = this.disclosureSummaries.concat(summaries.body);
               this.applicationState.loadingMore = false;
               this.applicationState.loadedAll = this.disclosureSummaries.length === this.applicationState.summaryCount;

               this.emitChange();
             }
           }));
  }

  updateCurrentComments(transitionLast) {
    this.applicationState.currentComments = this.applicationState.selectedDisclosure.comments.filter(comment => {
      return comment.topicSection === this.applicationState.commentTopic && comment.topicId === this.applicationState.commentId;
    });

    if (transitionLast && this.applicationState.currentComments.length > 0) {
      this.applicationState.currentComments[this.applicationState.currentComments.length - 1].new = true;
      setTimeout(() => {
        delete this.applicationState.currentComments[this.applicationState.currentComments.length - 1].new;
        this.emitChange();
      }, 30);
    }
  }

  showCommentingPanel(params) {
    this.applicationState.listShowing = false;
    this.applicationState.commentingPanelShowing = true;
    this.applicationState.commentTopic = params.topic;
    this.applicationState.commentId = params.id;
    this.applicationState.commentTitle = params.title;

    this.updateCurrentComments(false);
  }

  hideCommentingPanel() {
    this.applicationState.listShowing = true;
    setTimeout(() => {
      this.applicationState.commentingPanelShowing = false;
      this.emitChange();
    }, 400);
  }

  showAdditionalReviewPanel() {
    this.applicationState.listShowing = false;
    this.applicationState.additionalReviewShowing = true;
  }

  hideAdditionalReviewPanel() {
    this.applicationState.listShowing = true;
    setTimeout(() => {
      this.applicationState.additionalReviewShowing = false;
      this.emitChange();
    }, 400);
  }

  showGeneralAttachmentsPanel() {
    this.applicationState.listShowing = false;
    this.applicationState.generalAttachmentsShowing = true;
  }

  hideGeneralAttachmentsPanel() {
    this.applicationState.listShowing = true;
    setTimeout(() => {
      this.applicationState.generalAttachmentShowing = false;
      this.emitChange();
    }, 400);
  }

  showCommentSummary() {
    this.applicationState.listShowing = false;
    this.applicationState.commentSummaryShowing = true;
  }

  hideCommentSummary() {
    this.applicationState.listShowing = true;
    setTimeout(() => {
      this.applicationState.commentSummaryShowing = false;
      this.emitChange();
    }, 400);
  }

  makeComment(params) {
    createRequest().post('/api/coi/disclosures/' + this.applicationState.selectedDisclosure.id + '/comments')
           .send({
             topicSection: params.topicSection,
             topicId: params.topicId,
             visibleToPI: params.visibleToPI,
             visibleToReviewers: params.visibleToReviewers,
             text: params.commentText
           })
           .end(processResponse((err, updatedComments) => {
             if (!err) {
               this.applicationState.selectedDisclosure.comments = updatedComments.body;
               this.updateCurrentComments(true);
               this.emitChange();
             }
           }));
  }

  addManagementPlan(files) {
    let formData = new FormData();
    files.forEach(file => {
      formData.append('attachments', file);
    });

    formData.append('data', JSON.stringify({
      refId: this.applicationState.selectedDisclosure.id,
      type: COIConstants.FILE_TYPE.MANAGEMENT_PLAN
    }));

    createRequest().post('/api/coi/files')
    .send(formData)
    .end(processResponse((err, res) => {
      if (!err) {
        res.body.forEach(file => {
          this.applicationState.selectedDisclosure.managementPlan.push(file);
          this.emitChange();
        });
      }
    }));
  }

  deleteManagementPlan() {
    let file = this.applicationState.selectedDisclosure.managementPlan[0];

    createRequest().del('/api/coi/files/' + file.id)
    .send(file)
    .type('application/json')
    .end(processResponse((err) => {
      if (!err) {
        this.applicationState.selectedDisclosure.managementPlan.splice(0, 1);
        this.emitChange();
      }
    }));
  }
}

export let AdminStore = alt.createStore(_AdminStore, 'AdminStore');
