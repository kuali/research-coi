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

import PIReviewActions from '../actions/pi-review-actions';
import alt from '../alt';
import {processResponse, createRequest} from '../http-utils';
import ConfigActions from '../actions/config-actions';
import {FILE_TYPE, ROLES} from '../../../coi-constants';

function updateComment(reviewItem, text, commentFieldName = 'comments') {
  if (reviewItem.piResponse) {
    const commentToEdit = reviewItem[commentFieldName].find(
      commentToTest => commentToTest.id === 'temp'
    );
    
    if (commentToEdit) {
      commentToEdit.text = text;
    }
  }
  else {
    if (!Array.isArray(reviewItem[commentFieldName])) {
      reviewItem[commentFieldName] = [];
    }
    reviewItem[commentFieldName].push({
      date: new Date(),
      text,
      topicId: reviewItem.reviewId,
      userRole: ROLES.USER,
      id: 'temp'
    });
  }
}

class _PIReviewStore {
  constructor() {
    this.bindActions(PIReviewActions);

    this.applicationState = {
      canSubmit: false,
      showingCertification: false,
      pendingResponses: []
    };
  }

  updateCanSubmit() {
    const {questions, entities, declarations} = this.disclosure;

    if (questions) {
      const allQuestionsDone = questions.every(
        question => question.reviewedOn !== null
      );
      if (!allQuestionsDone) {
        this.applicationState.canSubmit = false;
        return;
      }
    }

    if (entities) {
      const allEntitiesDone = entities.every(
        entity => entity.reviewedOn !== null
      );
      if (!allEntitiesDone) {
        this.applicationState.canSubmit = false;
        return;
      }
    }

    if (declarations) {
      const allDeclarationsDone = declarations.every(declaration => {
        const allEntitiesDone = declaration.entities.every(
          entity => entity.reviewedOn !== null
        );
        return allEntitiesDone;
      });
      if (!allDeclarationsDone) {
        this.applicationState.canSubmit = false;
        return;
      }
    }

    this.applicationState.canSubmit = true;
  }

  loadDisclosure(disclosureId) {
    createRequest()
      .get(`/api/coi/disclosures/${disclosureId}/pi-review-items`)
      .end(processResponse((err, disclosure) => {
        if (err) {
          return;
        }

        this.disclosure = disclosure.body;
        this.disclosure.id = disclosureId;
        if (this.disclosure.questions) {
          this.disclosure.questions.forEach(questionMeta => {
            const {question} = questionMeta;

            if (question) {
              if (question.required_num_selections) {
                question.requiredNumSelections = question.required_num_selections;
                delete question.required_num_selections;
              }
              if (question.number_to_show) {
                question.numberToShow = question.number_to_show;
                delete question.number_to_show;
              }
            }
            if (questionMeta.answer) {
              questionMeta.answer = JSON.parse(questionMeta.answer);
            }

            if (questionMeta.subQuestions) {
              questionMeta.subQuestions = questionMeta.subQuestions.map(subQuestionMeta => {
                const {
                  id,
                  parent,
                  question: subQuestion,
                  answer: subAnswer
                } = subQuestionMeta;
                const newSub = {
                  id,
                  parent,
                  answer: {},
                  question: subQuestion
                };

                if (subAnswer) {
                  newSub.answer = JSON.parse(subAnswer);
                }

                if (newSub.question.required_num_selections) {
                  newSub.question.requiredNumSelections = newSub.question.required_num_selections;
                  delete newSub.question.required_num_selections;
                }
                if (newSub.question.number_to_show) {
                  newSub.question.numberToShow = newSub.question.number_to_show;
                  delete newSub.question.number_to_show;
                }
                if (newSub.question.display_criteria) {
                  newSub.question.displayCriteria = newSub.question.display_criteria;
                  delete newSub.question.display_criteria;
                }

                return newSub;
              });
            }
          });
        }

        if (this.disclosure.entities) {
          this.disclosure.entities.forEach(entity => {
            if (entity.answers) {
              entity.answers.forEach(answer => {
                answer.answer = JSON.parse(answer.answer);
              });
            }
          });
        }

        this.updateCanSubmit();
        ConfigActions.loadConfig(disclosure.body.configId);
        this.emitChange();
      }));
  }

  respond([reviewId, text]) {
    if (!text || text.length === 0) {
      return;
    }

    const {questions, entities, declarations} = this.disclosure;

    const questionToRespondTo = questions.find(
      question => reviewId === question.reviewId
    );
    if (questionToRespondTo) {
      questionToRespondTo.reviewedOn = new Date();
      updateComment(questionToRespondTo, text);
      questionToRespondTo.piResponse = {text};
    }

    const entityToRespondTo = entities.find(
      entity => reviewId === entity.reviewId
    );
    if (entityToRespondTo) {
      entityToRespondTo.reviewedOn = new Date();
      updateComment(entityToRespondTo, text);
      entityToRespondTo.piResponse = {text};
    }

    declarations.forEach(project => {
      project.entities.forEach(entity => {
        if (entity.reviewId === reviewId) {
          entity.reviewedOn = new Date();
          updateComment(entity, text, 'adminComments');
          entity.piResponse = {text};
        }
      });
    });

    this.updateCanSubmit();
    this.updatePendingResponses(reviewId, text);
  }

  updatePendingResponses(reviewId, comment) {
    const {pendingResponses} = this.applicationState;
    const toEdit = pendingResponses.find(
      response => response.reviewId === reviewId
    );

    if (toEdit) {
      toEdit.comment = comment;
    } else {
      pendingResponses.push({
        reviewId,
        comment
      });
    }
  }

  reviseScreeningQuestion([questionId, answer]) {
    const questionToRevise = this.disclosure.questions.find(
      question => questionId === question.id
    );
    if (questionToRevise) {
      questionToRevise.answer = {value: answer};
      questionToRevise.reviewedOn = new Date();
    }

    this.updateCanSubmit();

    createRequest()
      .put(
        `/api/coi/disclosures/${this.disclosure.id}/pi-revise-by-question-id/${questionId}`
      )
      .send({answer})
      .end(processResponse(() => {}));
  }

  reviseEntityQuestion([entityId, questionId, value]) {
    const entityToRevise = this.disclosure.entities.find(
      entity => entityId === entity.id
    );
    if (entityToRevise) {
      const theAnswer = entityToRevise.answers.find(
        answer => answer.questionId === questionId
      );

      if (theAnswer) {
        theAnswer.answer = {value};
      }

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    this.updateCanSubmit();

    createRequest()
      .put(
        `/api/coi/entities/${entityId}/entity-question/${questionId}`
      )
      .send({answer: value})
      .end(processResponse(() => {}));
  }

  addRelationship([entityId, newRelationship]) {
    const entityToRevise = this.disclosure.entities.find(
      entity => entityId === entity.id
    );
    if (entityToRevise) {
      if (entityToRevise.relationships === undefined) {
        entityToRevise.relationships = [];
      }
      entityToRevise.relationships.push({
        amount: '',
        comments: newRelationship.comments,
        finEntityId: entityToRevise.id,
        id: new Date().getTime(),
        person: '',
        relationship: '',
        type: ''
      });

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    this.updateCanSubmit();

    createRequest()
      .post(`/api/coi/entities/${entityId}/relationship`)
      .send(newRelationship)
      .end(processResponse((err, relationships) => {
        if (!err) {
          entityToRevise.relationships = relationships.body;
          this.emitChange();
        }
      }));
  }

  removeRelationship([entityId, relationshipId]) {
    const entityToRevise = this.disclosure.entities.find(
      entity => entityId === entity.id
    );
    if (entityToRevise) {
      entityToRevise.relationships = entityToRevise.relationships.filter(
        relationship => relationship.id !== relationshipId
      );

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    this.updateCanSubmit();

    createRequest()
      .del(`/api/coi/entities/${entityId}/relationship/${relationshipId}`)
      .end(processResponse(() => {}));
  }

  reviseDeclaration([entityId, projectId, disposition, comment]) {
    this.disclosure.declarations.forEach(project => {
      project.entities.forEach(entity => {
        if (entity.id === entityId && entity.projectId === projectId) {
          entity.reviewedOn = new Date();
          entity.revised = true;
          entity.comments = comment;
          entity.relationshipCd = parseInt(disposition);
        }
      });
    });

    this.updateCanSubmit();
    createRequest()
      .put(`/api/coi/entities/${entityId}/projects/${projectId}`)
      .send({
        disposition,
        comment
      })
      .end(processResponse(() => {}));
  }

  reviseSubQuestion([subQuestionId, value]) {
    let subQuestionToRevise;

    for (const question of this.disclosure.questions) {
      if (question.subQuestions) {
        subQuestionToRevise = question.subQuestions.find(
          subQuestion => subQuestion.id === subQuestionId
        );
        if (subQuestionToRevise) {
          break;
        }
      }
    }

    if (subQuestionToRevise) {
      subQuestionToRevise.answer = {value};
    }

    this.updateCanSubmit();

    createRequest()
      .put(`/api/coi/disclosures/${this.disclosure.id}/subquestion-answer/${subQuestionId}`)
      .send({
        answer: {value}
      })
      .type('application/json')
      .end(processResponse(() => {}));
  }

  deleteAnswers([questionId, newAnswer]) {
    const theQuestion = this.disclosure.questions.find(
      question => question.id === questionId
    );

    if (!theQuestion.subQuestions) {
      return;
    }

    const toDelete = theQuestion.subQuestions
      .filter(
        subQuestion => subQuestion.question.displayCriteria !== newAnswer
      ).map(
        subQuestion => subQuestion.id
      );

    if (toDelete.length === 0) {
      return;
    }

    createRequest()
      .del(`/api/coi/disclosures/${this.disclosure.id}/question-answers`)
      .send({toDelete})
      .type('application/json')
      .end(processResponse(() => {}));
  }

  submit() {
    this.applicationState.showingCertification = true;
  }

  confirm(disclosureId) {
    const {pendingResponses: responses} = this.applicationState;
    createRequest()
      .put(`/api/coi/pi-revise/${disclosureId}/submit`)
      .send({responses})
      .end(processResponse(() => {
        document.location = '/coi/';
      }));
  }

  addEntityAttachments([files, entityId]) {
    const entityToRevise = this.disclosure.entities.find(
      entity => entityId === entity.id
    );

    if (!entityToRevise.files) {
      entityToRevise.files = [];
    }

    const formData = new FormData();

    files.forEach(
      file => formData.append('attachments', file)
    );

    formData.append('data', JSON.stringify({
      refId: entityToRevise.id,
      type: FILE_TYPE.FINANCIAL_ENTITY,
      disclosureId: entityToRevise.disclosureId
    }));

    createRequest()
      .post('/api/coi/files')
      .send(formData)
      .end(processResponse((err, res) => {
        if (!err) {
          res.body.forEach(file => {
            entityToRevise.files.push(file);
          });
          entityToRevise.reviewedOn = new Date();
          entityToRevise.revised = 1;
          this.updateCanSubmit();
          this.emitChange();
        }
      }));
  }

  deleteEntityAttachment([index, entityId]) {
    const entityToRevise = this.disclosure.entities.find(
      entity => entityId === entity.id
    );
    const file = entityToRevise.files.find(f => f.id === Number(index));

    createRequest()
      .del(`/api/coi/files/${file.id}`)
      .end(processResponse(err => {
        if (!err) {
          entityToRevise.files = entityToRevise.files.filter(
            f => f.id !== Number(index)
          );
          entityToRevise.reviewedOn = new Date();
          entityToRevise.revised = 1;
          this.updateCanSubmit();
          this.emitChange();
        }
      }));
  }
}

export const PIReviewStore = alt.createStore(_PIReviewStore, 'PIReviewStore');
