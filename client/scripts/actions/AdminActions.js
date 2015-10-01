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

  toggleMobileFilters() { this.dispatch(); }

  loadDisclosure(id) { this.dispatch(id); }

  toggleApprovalConfirmation() { this.dispatch(); }

  toggleRejectionConfirmation() { this.dispatch(); }

  clearTypeFilter() { this.dispatch(); }

  toggleTypeFilter(toToggle) { this.dispatch(toToggle); }

  clearStatusFilter() { this.dispatch(); }

  toggleStatusFilter(toToggle) { this.dispatch(toToggle); }

  setSortDirection(newDirection) { this.dispatch(newDirection); }

  loadMore() {
    this.dispatch();
  }

  showCommentingPanel(topic, id, title) {
    this.dispatch({
      topic: topic,
      id: id,
      title: title
    });
  }

  hideCommentingPanel() { this.dispatch(); }

  showAdditionalReviewPanel() { this.dispatch(); }

  hideAdditionalReviewPanel() { this.dispatch(); }

  showCommentSummary() { this.dispatch(); }

  hideCommentSummary() { this.dispatch(); }

  makeComment(disclosureId, topicSection, topicId, visibleToPI, visibleToReviewers, commentText) {
    this.dispatch({
      disclosureId: disclosureId,
      topicSection: topicSection,
      topicId: topicId,
      visibleToPI: visibleToPI,
      visibleToReviewers: visibleToReviewers,
      commentText: commentText
    });
  }
}

export let AdminActions = alt.createActions(_AdminActions);
