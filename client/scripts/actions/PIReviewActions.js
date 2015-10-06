import alt from '../alt';

class _PIReviewActions {
  loadDisclosure(disclosureId) { this.dispatch(disclosureId); }

  respond(reviewId, comment) {
    this.dispatch({
      reviewId: reviewId,
      comment: comment
    });
  }
}

export default alt.createActions(_PIReviewActions);
