import alt from '../alt';

class _PIReviewActions {
  loadDisclosure(disclosureId) { this.dispatch(disclosureId); }

  respond(reviewId, comment) {
    this.dispatch({reviewId, comment});
  }

  revise(reviewId, newAnswer) {
    this.dispatch({reviewId, newAnswer});
  }

  reviseEntityQuestion(reviewId, questionId, newValue) {
    this.dispatch({reviewId, questionId, newValue});
  }

  addRelationship(reviewId, newRelationship) {
    this.dispatch({reviewId, newRelationship});
  }

  removeRelationship(entityId, reviewId, relationshipId) {
    this.dispatch({entityId, reviewId, relationshipId});
  }

  reviseDeclaration(reviewId, disposition, declarationComment) {
    this.dispatch({reviewId, disposition, declarationComment});
  }
}

export default alt.createActions(_PIReviewActions);
