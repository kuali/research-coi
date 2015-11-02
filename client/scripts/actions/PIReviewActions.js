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

  addEntityAttachments(files, entityId) { this.dispatch({files: files, entityId: entityId}); }

  deleteEntityAttachment(index, entityId) { this.dispatch({index: index, entityId: entityId}); }
}

export default alt.createActions(_PIReviewActions);
