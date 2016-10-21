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

/* eslint-disable no-eq-null */

import PIReviewActions from '../actions/pi-review-actions';
import alt from '../alt';
import {processResponse, createRequest} from '../http-utils';
import ConfigActions from '../actions/config-actions';
import {FILE_TYPE, ROLES} from '../../../coi-constants';

const queuedChanges = {
  screeningQuestions: {},
  subQuestions: {},
  deletedQuestions: {},
  entityQuestions: {},
  entityNameChanges: {}
};

function updateComment(reviewItem, text, commentFieldName = 'comments') {
  if (reviewItem.piResponse) {
    const commentToEdit = reviewItem[commentFieldName].find(
      commentToTest => commentToTest.current == true
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
      id: 'temp',
      current: true
    });
  }
}

function setPIResponseBasedOnComments(target, fieldToUse = 'comments') {
  if (target[fieldToUse]) {
    const currentComment = target[fieldToUse].find(
      comment => comment.current == true
    );
    if (currentComment) {
      target.piResponse = currentComment;
    }
  }
}

class _PIReviewStore {
  constructor() {
    this.bindActions(PIReviewActions);

    this.applicationState = {
      canSubmit: false,
      showingCertification: false
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
          entity => {
            if (entity.relationshipCd == null) {
              return false;
            }

            const hasAdminComment = (
              entity.adminComments &&
              entity.adminComments.length > 0
            );

            if (!hasAdminComment) {
              return true;
            }

            if (entity.reviewedOn == null) {
              return false;
            }

            return true;
          }
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
            setPIResponseBasedOnComments(questionMeta);

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
            setPIResponseBasedOnComments(entity);

            if (entity.answers) {
              entity.answers.forEach(answer => {
                answer.answer = JSON.parse(answer.answer);
              });
            }
          });
        }

        if (this.disclosure.declarations) {
          this.disclosure.declarations.forEach(project => {
            project.entities.forEach(entity => {
              setPIResponseBasedOnComments(entity, 'adminComments');
            });
          });
        }

        this.files = this.disclosure.files;
        this.updateCanSubmit();
        ConfigActions.loadConfig(disclosure.body.configId);
        this.emitChange();
      }));
  }

  addDisclosureAttachment(files) {
    if (!this.files) {
      this.files = [];
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('attachments', file);
    });

    formData.append('data', JSON.stringify({
      refId: this.disclosure.id,
      type: FILE_TYPE.DISCLOSURE,
      disclosureId: this.disclosure.id
    }));

    createRequest()
      .post('/api/coi/files')
      .send(formData)
      .end(processResponse((err, res) => {
        if (!err) {
          res.body.forEach(file => {
            this.files.push(file);
            this.emitChange();
          });

          this.loadDisclosure(this.disclosure.id);
        }
      }));
  }

  deleteDisclosureAttachment(id) {
    const index = this.files.findIndex(f => f.id === parseInt(id));
    createRequest()
      .del(`/api/coi/files/${id}`)
      .end(processResponse((err) => {
        if (!err) {
          this.files.splice(index, 1);
          this.emitChange();
          this.loadDisclosure(this.disclosure.id);
        }
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
    createRequest()
      .post(`/api/coi/pi-response/${reviewId}`)
      .send({comment: text})
      .end(processResponse(() => {}));
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
    }

    queuedChanges.screeningQuestions[questionId] = {
      disclosureId: this.disclosure.id,
      answer
    };
  }

  sendQueuedScreeningQuestionRevisions(questionId) {
    const questionToRevise = this.disclosure.questions.find(
      question => questionId === question.id
    );
    if (questionToRevise) {
      questionToRevise.reviewedOn = new Date();
    }

    this.updateCanSubmit();

    const toSend = queuedChanges.screeningQuestions[questionId];
    if (toSend) {
      createRequest()
        .put(
          `/api/coi/disclosures/${toSend.disclosureId}/pi-revise-by-question-id/${questionId}`
        )
        .send({answer: toSend.answer})
        .end(processResponse(() => {}));
    }

    delete queuedChanges.screeningQuestions[questionId];
  }

  reviseEntityQuestion([entityId, questionId, value]) {
    const entityToRevise = this.disclosure.entities.find(
      entity => entityId === entity.id
    );
    if (entityToRevise) {
      if (Array.isArray(entityToRevise.answers)) {
        const theAnswer = entityToRevise.answers.find(
          answer => answer.questionId === questionId
        );

        if (theAnswer) {
          theAnswer.answer = {value};
        }
        else {
          entityToRevise.answers.push({
            answer: {value},
            finEntityId: entityId,
            questionId
          });
        }
      }
      else {
        entityToRevise.answers = [{
          answer: {value},
          finEntityId: entityId,
          questionId
        }];
      }

      entityToRevise.revised = 1;
    }

    if (!queuedChanges.entityQuestions[entityId]) {
      queuedChanges.entityQuestions[entityId] = {
        questions: []
      };
    }
    const queue = queuedChanges.entityQuestions[entityId];

    queue.questions = queue.questions.filter(
      question => question.questionId !== questionId
    );
    queue.questions.push({
      questionId,
      value
    });
  }

  sendQueuedEntityQuestionRevisions(entityId) {
    const entityToRevise = this.disclosure.entities.find(
      entity => entityId === entity.id
    );
    if (entityToRevise) {
      entityToRevise.reviewedOn = new Date();
    }

    this.updateCanSubmit();

    const toSend = queuedChanges.entityQuestions[entityId];
    if (toSend) {
      for (const question of toSend.questions) {
        createRequest()
          .put(
            `/api/coi/entities/${entityId}/entity-question/${question.questionId}`
          )
          .send({answer: question.value})
          .end(processResponse(() => {}));
      }
    }
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

    queuedChanges.subQuestions[subQuestionId] = {
      disclosureId: this.disclosure.id,
      value
    };
  }

  sendQueuedSubQuestionRevisions(questionIds) {
    this.updateCanSubmit();

    for (const questionId of questionIds) {
      const toSend = queuedChanges.subQuestions[questionId];
      if (toSend) {
        createRequest()
          .put(`/api/coi/disclosures/${toSend.disclosureId}/subquestion-answer/${questionId}`)
          .send({
            answer: {value: toSend.value}
          })
          .type('application/json')
          .end(processResponse(() => {}));
      }

      delete queuedChanges.subQuestions[questionId];
    }
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

    queuedChanges.deletedQuestions[questionId] = {
      disclosureId: this.disclosure.id,
      toDelete
    };
  }

  sendQueuedQuestionDeletions(questionId) {
    const toSend = queuedChanges.deletedQuestions[questionId];

    if (toSend) {
      createRequest()
        .del(`/api/coi/disclosures/${toSend.disclosureId}/question-answers`)
        .send({toDelete: toSend.toDelete})
        .type('application/json')
        .end(processResponse(() => {}));

      delete queuedChanges.deletedQuestions[questionId];
    }
  }

  submit() {
    this.applicationState.showingCertification = true;
  }

  confirm(disclosureId) {
    createRequest()
      .put(`/api/coi/pi-revise/${disclosureId}/submit`)
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

  addEntity(entity) {
    this.disclosure.entities.push(entity);
  }

  setEntityName([entityId, name]) {
    const entity = this.disclosure.entities.find(e => e.id === entityId);

    if (entity) {
      entity.name = name;

      if (this.disclosure.declarations) {
        this.disclosure.declarations.forEach(declaration => {
          declaration.entities
            .filter(e => e.id === entityId)
            .forEach(e => {
              e.name = name;
            });
        });
      }

      queuedChanges.entityNameChanges[entityId] = name;
    }
  }

  sendQueuedEntityNameChanges(entityId) {
    this.updateCanSubmit();

    const name = queuedChanges.entityNameChanges[entityId];

    createRequest()
      .put(`/api/coi/entities/${entityId}/name`)
      .send({name})
      .type('application/json')
      .end(processResponse(() => {}));

    delete queuedChanges.entityNameChanges[entityId];
  }
}

export const PIReviewStore = alt.createStore(_PIReviewStore, 'PIReviewStore');
