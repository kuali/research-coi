import alt from '../alt';

class _PIReviewActions {
  loadDisclosure(disclosureId) { this.dispatch(disclosureId); }

  respond(reviewId, comment) {
    this.dispatch({
      reviewId: reviewId,
      comment: comment
    });
  }

  revise(reviewId, newAnswer) {
    this.dispatch({
      reviewId: reviewId,
      newAnswer: newAnswer
    });
  }
}

export default alt.createActions(_PIReviewActions);
