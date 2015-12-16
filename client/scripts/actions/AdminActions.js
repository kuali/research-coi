/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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

  clearSubmittedByFilter() { this.dispatch(); }

  setSubmittedByFilter(name) { this.dispatch(name); }

  changeReporterFilter(newFilter) { this.dispatch(newFilter); }

  toggleFilters() { this.dispatch(); }

  loadDisclosure(id) { this.dispatch(id); }

  loadArchivedDisclosure(id) { this.dispatch(id); }

  toggleApprovalConfirmation() { this.dispatch(); }

  approveDisclosure() { this.dispatch(); }

  toggleRejectionConfirmation() { this.dispatch(); }

  rejectDisclosure() { this.dispatch(); }

  clearTypeFilter() { this.dispatch(); }

  toggleTypeFilter(toToggle) { this.dispatch(toToggle); }

  clearStatusFilter() { this.dispatch(); }

  toggleStatusFilter(toToggle) { this.dispatch(toToggle); }

  setSortDirection(newDirection) { this.dispatch(newDirection); }

  loadMore() {
    this.dispatch();
  }

  showCommentingPanel(topic, id, title) {
    this.dispatch({topic, id, title});
  }

  hideCommentingPanel() { this.dispatch(); }

  showAdditionalReviewPanel() { this.dispatch(); }

  hideAdditionalReviewPanel() { this.dispatch(); }

  showGeneralAttachmentsPanel() { this.dispatch(); }

  hideGeneralAttachmentsPanel() { this.dispatch(); }

  showCommentSummary() { this.dispatch(); }

  hideCommentSummary() { this.dispatch(); }

  makeComment(disclosureId, topicSection, topicId, visibleToPI, visibleToReviewers, commentText) {
    this.dispatch({
      disclosureId,
      topicSection,
      topicId,
      visibleToPI,
      visibleToReviewers,
      commentText
    });
  }

  addManagementPlan(files) { this.dispatch(files); }

  deleteManagementPlan() { this.dispatch(); }

}

export const AdminActions = alt.createActions(_AdminActions);
