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

  reviseSubQuestion(reviewId, subQuestionId, answer) {
    this.dispatch({reviewId, subQuestionId, answer});
  }

  deleteAnswers(reviewId, toDelete) {
    this.dispatch({reviewId, toDelete});
  }

  submit() {
    this.dispatch();
  }

  confirm(disclosureId) {
    this.dispatch(disclosureId);
  }
}

export default alt.createActions(_PIReviewActions);
