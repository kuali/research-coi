/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import {get} from 'lodash';
import {AdminActions} from '../actions/admin-actions';
import {
  NO_DISPOSITION,
  DISCLOSURE_STATUS,
  FILE_TYPE,
  DATE_TYPE,
  ADMIN_PAGE_SIZE
} from '../../../coi-constants';
import alt from '../alt';
import {processResponse, createRequest} from '../http-utils';
import ConfigActions from '../actions/config-actions';
import {
  default as ConfigStore,
  getDispositionsEnabled
} from './config-store';

function defaultStatusFilters() {
  return [2, 4, 5, 6];
}

function resetComment(comment) {
  return {
    text: '',
    piVisible: 0,
    reviewerVisible: 0,
    topicId: comment.topicId,
    topicSection: comment.topicSection,
    title: comment.title
  };
}

class _AdminStore {
  constructor() {
    this.exportPublicMethods({
      createAdminAttachmentFormData: this.createAdminAttachmentFormData
    });

    this.bindActions(AdminActions);
    this.applicationState = {
      sort: 'SUBMITTED_DATE',
      sortDirection: 'ASCENDING',
      filters: {
        date: {
          start: undefined,
          end: undefined
        },
        submittedBy: undefined,
        status: defaultStatusFilters(),
        type: [],
        search: '',
        disposition: null,
        reviewStatus: {
          assigned: true,
          notAssigned: true
        }
      },
      effectiveSearchValue: '',
      showFilters: true,
      showingApproval: false,
      showingRejection: false,
      showReturnToReporterConfirmation: false,
      selectedDisclosure: undefined,
      loadingMore: false,
      offset: 0,
      loadedAll: false,
      summaryCount: 0,
      listShowing: true,
      commentingPanelShowing: false,
      additionalReviewShowing: false,
      commentSummaryShowing: false,
      uploadAttachmentsShowing: false,
      loadingDisclosure: false,
      reviewerSearchValue: '',
      comment: {
        text: '',
        piVisible: 0,
        reviewerVisible: 0
      },
      returnToReporterComment: {
        text: ''
      }
    };

    this.disclosureSummaries = [];
    this.refreshDisclosures();
  }

  morePossibleSummaries(summaries) {
    return summaries.length !== 0 && summaries.length % ADMIN_PAGE_SIZE === 0;
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

  getDisclosureSummariesQuery() {
    return {
      sortColumn: this.applicationState.sort,
      sortDirection: this.applicationState.sortDirection,
      filters: encodeURIComponent(JSON.stringify(this.applicationState.filters)),
      start: this.applicationState.offset
    };
  }

  refreshDisclosures() {
    this.applicationState.offset = 0;
    this.applicationState.loadingMore = true;

    createRequest()
      .get('/api/coi/disclosure-summaries')
      .query(this.getDisclosureSummariesQuery())
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
    delete this.applicationState.selectedDisclosure;
    this.applicationState.loadingDisclosure = true;

    createRequest()
      .get(`/api/coi/disclosures/${id}`)
      .end(processResponse((err, disclosure) => {
        if (!err) {
          this.loadDisclosureData(disclosure.body);
        }
      }));

    createRequest()
      .get(`/api/coi/disclosures/${id}/pi-responses`)
      .end(processResponse((err, responses) => {
        if (!err) {
          this.applicationState.piResponses = responses.body;
          this.emitChange();
        }
      }));

    createRequest().get('/api/coi/reviewers')
      .end(processResponse((err, responses) => {
        if (!err) {
          this.applicationState.displayAdditionalReviewers = responses.body.length > 0;
          this.emitChange();
        }
      }));
  }

  loadArchivedDisclosure(id) {
    createRequest()
      .get(`/api/coi/archived-disclosures/${id}/latest`)
      .end(processResponse((err, disclosure) => {
        if (!err) {
          this.loadDisclosureData(disclosure.body);
        }
      }));
  }

  loadDisclosureData(disclosure) {
    disclosure.comments = disclosure.comments.filter(
      comment => comment.current != true
    );
    this.applicationState.selectedDisclosure = disclosure;
    this.applicationState.loadingDisclosure = false;
    ConfigActions.loadConfig(disclosure.configId);
    this.emitChange();
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
    const shouldRefresh = newSearch.length > 2 || this.applicationState.filters.search.length > newSearch.length;
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

  clearReviewerFilter() {
    this.applicationState.filters.reviewers = undefined;
    this.applicationState.reviewerFilterValues = undefined;
    this.refreshDisclosures();
  }

  clearReviewStatusFilter() {
    this.applicationState.filters.reviewStatus = {
      assigned: true,
      notAssigned: true
    };
    this.refreshDisclosures();
  }

  removeReviewerFilter(id) {
    const valueIndex = this.applicationState.reviewerFilterValues.findIndex(r => r.userId === id);
    const filterIndex = this.applicationState.filters.reviewers.findIndex(r => r === id);
    this.applicationState.reviewerFilterValues.splice(valueIndex, 1);
    this.applicationState.filters.reviewers.splice(filterIndex, 1);
    if (this.applicationState.filters.reviewers.length < 1) {
      this.applicationState.filters.reviewers = undefined;
    }
    this.refreshDisclosures();
  }

  setReviewerFilter(reviewer) {
    if (!this.applicationState.filters.reviewers) {
      this.applicationState.filters.reviewers = [];
    }

    if (!this.applicationState.reviewerFilterValues) {
      this.applicationState.reviewerFilterValues = [];
    }

    this.applicationState.reviewerFilterValues.push(reviewer);
    this.applicationState.filters.reviewers.push(reviewer.userId);

    this.refreshDisclosures();
  }

  changeReporterFilter(newFilter) {
    this.applicationState.filters.reporterName = newFilter;
  }

  toggleFilters() {
    this.applicationState.showFilters = !this.applicationState.showFilters;
  }

  toggleApprovalConfirmation() {
    this.applicationState.showingApproval = !this.applicationState.showingApproval;
  }

  approveDisclosure() {
    createRequest()
      .put(`/api/coi/disclosures/${this.applicationState.selectedDisclosure.id}/approve`)
      .send(this.applicationState.selectedDisclosure)
      .type('application/json')
      .end(processResponse(err => {
        if (!err) {
          window.location = `/coi/admin/detailview/${this.applicationState.selectedDisclosure.id}/${DISCLOSURE_STATUS.UP_TO_DATE}`;
        }
      }));
  }

  toggleRejectionConfirmation() {
    this.applicationState.showingRejection = !this.applicationState.showingRejection;
  }

  toggleReturnToReporterConfirmation() {
    this.applicationState.showReturnToReporterConfirmation = !this.applicationState.showReturnToReporterConfirmation;
  }

  makeAllCommentsNotEditable() {
    const {selectedDisclosure} = this.applicationState;
    selectedDisclosure.comments = selectedDisclosure.comments.map(comment => {
      comment.editable = false;
      return comment;
    });
  }

  returnToReporter() {
    createRequest().put(`/api/coi/disclosures/${this.applicationState.selectedDisclosure.id}/return`)
      .send(this.applicationState.returnToReporterComment)
      .end(processResponse((err) => {
        if (!err) {
          this.makeAllCommentsNotEditable();
          this.applicationState.selectedDisclosure.statusCd = DISCLOSURE_STATUS.RETURNED;
          this.applicationState.selectedDisclosure.returnedDate = new Date();
          this.applicationState.showReturnToReporterConfirmation = !this.applicationState.showReturnToReporterConfirmation;
          this.emitChange();
        }
      }));
  }

  rejectDisclosure() {
    createRequest()
      .put(`/api/coi/disclosures/${this.applicationState.selectedDisclosure.id}/reject`)
      .end(processResponse((err) => {
        if (!err) {
          this.makeAllCommentsNotEditable();
          this.applicationState.selectedDisclosure.statusCd = DISCLOSURE_STATUS.REVISION_REQUIRED;
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
    const index = this.applicationState.filters.type.findIndex(filter => {
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
    this.applicationState.filters.status = defaultStatusFilters();
    this.refreshDisclosures();
  }

  toggleStatusFilter(toToggle) {
    const index = this.applicationState.filters.status.findIndex(filter => {
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

  toggleReviewStatusFilter(toToggle) {
    const {filters} = this.applicationState;
    if (toToggle === 'Assigned') {
      filters.reviewStatus.assigned = !filters.reviewStatus.assigned;
    }
    else if (toToggle === 'Not') {
      filters.reviewStatus.notAssigned = !filters.reviewStatus.notAssigned;
    }

    this.refreshDisclosures();
  }

  clearDispositionFilter() {
    this.applicationState.filters.disposition = null;
    this.refreshDisclosures();
  }

  turnOnAllDispositionFilters() {
    let dispositions = [];
    const configState = ConfigStore.getState();
    if (getDispositionsEnabled(configState)) {
      dispositions = configState.config.dispositionTypes;
      dispositions = dispositions.map(disposition =>
        disposition.typeCd
      );
    }

    dispositions.push(NO_DISPOSITION);
    this.applicationState.filters.disposition = dispositions;
  }

  toggleDispositionFilter(toToggle) {
    if (this.applicationState.filters.disposition === null) {
      this.turnOnAllDispositionFilters();
    }

    const index = this.applicationState.filters.disposition.findIndex(filter =>
      filter === toToggle.typeCd
    );
    if (index === -1) {
      this.applicationState.filters.disposition.push(toToggle.typeCd);
    }
    else {
      this.applicationState.filters.disposition.splice(index, 1);
    }

    this.refreshDisclosures();
  }

  loadMore() {
    if (this.applicationState.loadedAll) {
      return false;
    }

    this.applicationState.loadingMore = true;
    this.applicationState.offset += ADMIN_PAGE_SIZE;

    createRequest()
      .get('/api/coi/disclosure-summaries')
      .query(this.getDisclosureSummariesQuery())
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
      return comment.topicSection === this.applicationState.comment.topicSection && comment.topicId === this.applicationState.comment.topicId;
    });

    if (transitionLast && this.applicationState.currentComments.length > 0) {
      this.applicationState.currentComments[this.applicationState.currentComments.length - 1].new = true;
      setTimeout(() => {
        delete this.applicationState.currentComments[this.applicationState.currentComments.length - 1].new;
        this.emitChange();
      }, 30);
    }
  }

  showCommentingPanel([topicSection, topicId, title]) {
    this.applicationState.listShowing = false;
    this.applicationState.commentingPanelShowing = true;
    this.applicationState.comment = {
      text: '',
      piVisible: 0,
      reviewerVisible: 0,
      title,
      topicSection,
      topicId
    };
    this.applicationState.commentSnapShot = undefined;
    this.applicationState.editingComment = false;

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
      this.applicationState.generalAttachmentsShowing = false;
      this.emitChange();
    }, 400);
  }

  showUploadAttachmentsPanel() {
    this.applicationState.listShowing = false;
    this.applicationState.uploadAttachmentsShowing = true;
  }

  hideUploadAttachmentsPanel(timeout) {
    timeout = !isNaN(timeout) ? timeout : 400; // eslint-disable-line no-param-reassign
    this.applicationState.listShowing = true;
    setTimeout(() => {
      this.applicationState.uploadAttachmentsShowing = false;
      this.emitChange();
    }, timeout);
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

  updateCommentState(comments) {
    this.applicationState.selectedDisclosure.comments = comments;
    this.applicationState.comment = resetComment(this.applicationState.comment);
    this.applicationState.commentSnapShot = undefined;
    this.applicationState.editingComment = false;
  }

  makeComment(comment) {
    if (comment.id) {
      this.updateComment(comment);
    } else {
      createRequest().post(`/api/coi/disclosures/${this.applicationState.selectedDisclosure.id}/comments`)
        .send(comment)
        .end(processResponse((err, updatedComments) => {
          if (!err) {
            this.updateCommentState(updatedComments.body);
            this.updateCurrentComments(true);
            this.emitChange();
          }
        }));
    }
  }

  updateComment(comment) {
    if (comment.id) {
      createRequest().put(`/api/coi/disclosures/${this.applicationState.selectedDisclosure.id}/comments/${comment.id}`)
        .send(comment)
        .end(processResponse((err, updatedComments) => {
          if (!err) {
            this.updateCommentState(updatedComments.body);
            this.updateCurrentComments(false);
            this.emitChange();
          }
        }));
    }
  }

  toggleCommentViewableByReporter(id) {
    const commentToToggle = this.findCurrentCommentById(id);

    if (commentToToggle) {
      commentToToggle.piVisible = !commentToToggle.piVisible;
      this.updateComment(commentToToggle);
    }
  }

  addManagementPlan(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('attachments', file);
    });

    formData.append('data', JSON.stringify({
      refId: this.applicationState.selectedDisclosure.id,
      type: FILE_TYPE.MANAGEMENT_PLAN,
      disclosureId: this.applicationState.selectedDisclosure.id
    }));

    createRequest()
      .post('/api/coi/files')
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

  deleteManagementPlan(fileId) {
    const {managementPlan} = this.applicationState.selectedDisclosure;
    const fileIndex = managementPlan.findIndex(
      f => Number(f.id) === Number(fileId)
    );
    if (fileIndex < 0) {
      return;
    }
    const file = managementPlan[fileIndex];

    createRequest()
      .del(`/api/coi/files/${file.id}`)
      .end(processResponse((err) => {
        if (!err) {
          managementPlan.splice(fileIndex, 1);
          this.emitChange();
        }
      }));
  }

  addAdminAttachment(files) {
    createRequest().post('/api/coi/files')
      .send(this.createAdminAttachmentFormData(files))
      .end(processResponse((err, res) => {
        if (!err) {
          this.addAdminAttachmentToState(res.body);
          this.emitChange();
        }
      })
    );
  }

  createAdminAttachmentFormData(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('attachments', file);
    });

    formData.append('data', JSON.stringify({
      refId: this.applicationState.selectedDisclosure.id,
      type: FILE_TYPE.ADMIN,
      disclosureId: this.applicationState.selectedDisclosure.id
    }));

    return formData;
  }

  addAdminAttachmentToState(files) {
    if (!this.applicationState.selectedDisclosure.files) {
      this.applicationState.selectedDisclosure.files = [];
    }
    files.forEach(file => {
      this.applicationState.selectedDisclosure.files.push(file);
    });
  }

  deleteAdminAttachment(id) {
    createRequest().del(`/api/coi/files/${id}`)
      .type('application/json')
      .end(processResponse((err) => {
        if (!err) {
          this.removeAdminAttachmentFromState(id);
          this.emitChange();
        }
      }));
  }

  removeAdminAttachmentFromState(id) {
    const index = this.applicationState.selectedDisclosure.files.findIndex(f => parseInt(id) === f.id);
    this.applicationState.selectedDisclosure.files.splice(index, 1);
  }

  setApplicationStateForTest(update) {
    this.applicationState = Object.assign({}, this.applicationState, update);
  }

  populateReviewer(disclosureId, reviewer) {
    reviewer.disclosureId = disclosureId;
    reviewer.name = reviewer.value;
    reviewer.active = true;
    return reviewer;
  }

  addReviewerToState(reviewer) {
    if (this.applicationState.selectedDisclosure.reviewers === undefined) {
      this.applicationState.selectedDisclosure.reviewers = [];
    }

    this.applicationState.selectedDisclosure.reviewers.push(reviewer);
  }

  addAdditionalReviewer(suggestion) {
    createRequest().post('/api/coi/additional-reviewers')
      .send(
        this.populateReviewer(
          this.applicationState.selectedDisclosure.id,
          suggestion
        )
      )
      .end(processResponse((err, res) => {
        if (!err) {
          this.addReviewerToState(res.body);
          this.emitChange();
        }
      }));
  }

  updateAdditionalReviewer(id) {
    const reviewer = this.applicationState.selectedDisclosure.reviewers.find(r => r.id === id);
    reviewer.active = true;
    reviewer.dates.push({
      type: DATE_TYPE.ASSIGNED,
      date: new Date()
    });
    return reviewer;
  }

  reassignAdditionalReviewer(id) {
    createRequest().put(`/api/coi/additional-reviewers/${id}`)
      .send(this.updateAdditionalReviewer(id))
      .end(processResponse((err) => {
        if (!err) {
          this.emitChange();
        }
      }));
  }

  removeReviewerFromState(id) {
    const reviewers = get(this, 'applicationState.selectedDisclosure.reviewers');
    if (!reviewers) {
      return;
    }

    const theReviewer = reviewers.find(reviewer => reviewer.id === id);
    if (!theReviewer) {
      return;
    }

    if (!theReviewer.dates) {
      theReviewer.dates = [];
    }

    theReviewer.dates.push({
      date: new Date(),
      type: DATE_TYPE.UNASSIGNED
    });
    theReviewer.active = false;
  }

  removeAdditionalReviewer(id) {
    createRequest()
      .del(`/api/coi/additional-reviewers/${id}`)
      .end(processResponse(() => {}));

    this.removeReviewerFromState(id);
  }

  completeReview() {
    createRequest().put(`/api/coi/additional-reviewers/complete-review/${this.applicationState.selectedDisclosure.id}`)
      .end(processResponse(err => {
        if (!err) {
          window.location = '/coi/admin';
        }
      }));
  }

  toggleReviewer() {
    this.applicationState.comment.reviewerVisible = this.applicationState.comment.reviewerVisible === 0 ? 1 : 0;
  }

  toggleReporter() {
    this.applicationState.comment.piVisible = this.applicationState.comment.piVisible === 0 ? 1 : 0;
  }

  updateGeneralComment(text) {
    this.applicationState.returnToReporterComment.text = text.target.value;
  }

  updateCommentText(evt) {
    this.applicationState.comment.text = evt.target.value;
  }

  findCurrentCommentById(id) {
    return this.applicationState.currentComments.find(comment => {
      return comment.id == id; // eslint-disable-line eqeqeq
    });
  }

  editComment(id) {
    this.applicationState.editingComment = true;
    const commentToEdit = this.findCurrentCommentById(id);

    this.applicationState.comment = JSON.parse(JSON.stringify(commentToEdit));
    this.applicationState.commentSnapShot = JSON.parse(JSON.stringify(commentToEdit));
    this.applicationState.currentComments = this.applicationState.currentComments.filter(comment => {
      return comment.id != id; // eslint-disable-line eqeqeq
    });
  }

  cancelComment() {
    if (this.applicationState.commentSnapShot) {
      this.applicationState.currentComments.push(this.applicationState.commentSnapShot);
    }

    this.applicationState.comment = resetComment(this.applicationState.comment);
    this.applicationState.editingComment = false;
  }

  updateProjectDisposition(data) {
    createRequest().put(`/api/coi/project-persons-disposition-types/${data.projectPersonId}`)
      .send({dispositionTypeCd: data.dispositionTypeCd})
      .end(processResponse(err => {
        if (!err) {
          this.applicationState.selectedDisclosure.declarations.filter(declaration => {
            return declaration.projectPersonId === data.projectPersonId;
          }).forEach(declaration => {
            declaration.dispositionTypeCd = data.dispositionTypeCd;
          });
          this.emitChange();
        }
      }));
  }

  updateAdminRelationship({declarationId, adminRelationshipCd}) {
    const { id, declarations } = this.applicationState.selectedDisclosure;
    const declaration = declarations.find(d => d.id === declarationId);
    declaration.adminRelationshipCd = adminRelationshipCd;
    createRequest()
      .put(`/api/coi/disclosures/${id}/declarations/${declarationId}`)
      .send(declaration)
      .end(processResponse(err => {
        if (!err) {
          this.emitChange();
        }
      }));
  }

  updateReviewerRelationship({declarationId, dispositionCd}) {
    const { id, declarations } = this.applicationState.selectedDisclosure;
    const declaration = declarations.find(d => d.id === declarationId);
    declaration.reviewerRelationshipCd = dispositionCd;
    this.emitChange();
    createRequest()
      .put(`/api/coi/reviewers/${id}/recommend/${declarationId}`)
      .send({dispositionCd})
      .end(processResponse(() => {}));
  }

  recommendProjectDisposition({projectPersonId, dispositionTypeCd}) {
    const { selectedDisclosure } = this.applicationState;
    if (!selectedDisclosure.recommendedProjectDispositions) {
      selectedDisclosure.recommendedProjectDispositions = [];
    }
    const existing = selectedDisclosure.recommendedProjectDispositions.find(recommendation => {
      return recommendation.projectPersonId === projectPersonId;
    });
    if (existing) {
      existing.disposition = dispositionTypeCd;
    }
    else {
      selectedDisclosure.recommendedProjectDispositions.push({
        projectPersonId,
        disposition: dispositionTypeCd
      });
    }

    createRequest()
      .put(`/api/coi/reviewers/${selectedDisclosure.id}/recommendProject/${projectPersonId}`)
      .send({dispositionTypeCd})
      .end(processResponse(() => {}));
  }

  showArchivedDisclosure(id) {
    this.applicationState.currentArchiveId = id;

    createRequest()
      .get(`/api/coi/archived-disclosures/${id}`)
      .end(processResponse((err, archivedDisclosure) => {
        this.applicationState.currentArchivedDisclosure = archivedDisclosure.body;
        this.emitChange();
      }));
  }

  closeArchivedDisclosureModal() {
    delete this.applicationState.currentArchiveId;
    delete this.applicationState.currentArchivedDisclosure;
  }
}

export const AdminStore = alt.createStore(_AdminStore, 'AdminStore');
