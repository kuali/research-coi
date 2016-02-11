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

import PIReviewActions from '../actions/pi-review-actions';
import alt from '../alt';
import {processResponse, createRequest} from '../http-utils';
import ConfigActions from '../actions/config-actions';
import {COIConstants} from '../../../coi-constants';

class _PIReviewStore {
  constructor() {
    this.bindActions(PIReviewActions);

    this.applicationState = {
      canSubmit: false,
      showingCertification: false
    };
  }

  updateCanSubmit() {
    if (this.disclosure.questions) {
      const allQuestionsDone = this.disclosure.questions.every(question => {
        return question.reviewedOn !== null;
      });
      if (!allQuestionsDone) {
        this.applicationState.canSubmit = false;
        return;
      }
    }

    if (this.disclosure.entities) {
      const allEntitiesDone = this.disclosure.entities.every(entity => {
        return entity.reviewedOn !== null;
      });
      if (!allEntitiesDone) {
        this.applicationState.canSubmit = false;
        return;
      }
    }

    if (this.disclosure.declarations) {
      const allDeclarationsDone = this.disclosure.declarations.every(declaration => {
        const allEntitiesDone = declaration.entities.every(entity => {
          return entity.reviewedOn !== null;
        });
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
    createRequest().get(`/api/coi/disclosures/${disclosureId}/pi-review-items`)
           .end(processResponse((err, disclosure) => {
             if (!err) {
               this.disclosure = disclosure.body;
               if (this.disclosure.questions) {
                 this.disclosure.questions.forEach(question => {
                   if (question.question) {
                     if (question.question.required_num_selections) {
                       question.question.requiredNumSelections = question.question.required_num_selections;
                       delete question.question.required_num_selections;
                     }
                     if (question.question.number_to_show) {
                       question.question.numberToShow = question.question.number_to_show;
                       delete question.question.number_to_show;
                     }
                   }
                   if (question.answer) {
                     question.answer = JSON.parse(question.answer);
                   }

                   if (question.subQuestions) {
                     question.subQuestions = question.subQuestions.map(subQuestion => {
                       const newSub = {
                         id: subQuestion.id,
                         parent: subQuestion.parent,
                         answer: {},
                         question: subQuestion.question
                       };

                       if (subQuestion.answer) {
                         newSub.answer = JSON.parse(subQuestion.answer);
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

               createRequest().get(`/api/coi/archived-config/${disclosure.body.configId}`)
               .end(processResponse((error, config) => {
                 if (!error) {
                   window.config = config.body;
                   ConfigActions.loadConfig(disclosure.body.configId);
                   this.emitChange();
                 }
               }));
             }
           }));
  }

  respond([reviewId, comment]) {
    const questionToRespondTo = this.disclosure.questions.find(question => {
      return reviewId === question.reviewId;
    });
    if (questionToRespondTo) {
      questionToRespondTo.reviewedOn = new Date();
      questionToRespondTo.piResponse = {
        text: comment
      };
    }

    const entityToRespondTo = this.disclosure.entities.find(entity => {
      return reviewId === entity.reviewId;
    });
    if (entityToRespondTo) {
      entityToRespondTo.reviewedOn = new Date();
    }

    this.disclosure.declarations.forEach(project => {
      project.entities.forEach(entity => {
        if (entity.reviewId === reviewId) {
          entity.reviewedOn = new Date();
          entity.piResponse = {
            text: comment
          };
        }
      });
    });

    this.updateCanSubmit();
    createRequest().post(`/api/coi/pi-response/${reviewId}`)
      .send({
        comment
      })
      .end(processResponse(() => {
      }));
  }

  revise([reviewId, newAnswer]) {
    const questionToRevise = this.disclosure.questions.find(question => {
      return reviewId === question.reviewId;
    });
    if (questionToRevise) {
      questionToRevise.answer = {
        value: newAnswer
      };
      questionToRevise.reviewedOn = new Date();
    }

    this.updateCanSubmit();

    createRequest().put(`/api/coi/pi-revise/${reviewId}`)
      .send({
        answer: newAnswer
      })
      .end(processResponse(() => {}));
  }

  reviseEntityQuestion([reviewId, questionId, newValue]) {
    const entityToRevise = this.disclosure.entities.find(entity => {
      return reviewId === entity.reviewId;
    });
    if (entityToRevise) {
      const theAnswer = entityToRevise.answers.find(answer => {
        return answer.questionId === questionId;
      });

      if (theAnswer) {
        theAnswer.answer = {
          value: newValue
        };
      }

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    this.updateCanSubmit();

    createRequest().put(`/api/coi/pi-revise/${reviewId}/entity-question/${questionId}`)
      .send({
        answer: newValue
      })
      .end(processResponse(() => {}));
  }

  addRelationship([reviewId, newRelationship]) {
    const entityToRevise = this.disclosure.entities.find(entity => {
      return reviewId === entity.reviewId;
    });
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

    createRequest().post(`/api/coi/pi-revise/${reviewId}/entity-relationship`)
      .send(newRelationship)
      .end(processResponse((err, relationships) => {
        if (!err) {
          entityToRevise.relationships = relationships.body;
          this.emitChange();
        }
      }));
  }

  removeRelationship([entityId, reviewId, relationshipId]) {
    const entityToRevise = this.disclosure.entities.find(entity => {
      return entityId === entity.id;
    });
    if (entityToRevise) {
      entityToRevise.relationships = entityToRevise.relationships.filter(relationship => {
        return relationship.id !== relationshipId;
      });

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    this.updateCanSubmit();

    createRequest().del(`/api/coi/pi-revise/${reviewId}/entity-relationship/${relationshipId}`)
      .end(processResponse(() => {}));
  }

  reviseDeclaration([reviewId, disposition, comment]) {
    this.disclosure.declarations.forEach(project => {
      project.entities.forEach(entity => {
        if (entity.reviewId === reviewId) {
          entity.reviewedOn = new Date();
          entity.revised = true;
          entity.comments = comment;
          entity.relationshipCd = parseInt(disposition);
        }
      });
    });

    this.updateCanSubmit();
    createRequest().put(`/api/coi/pi-revise/${reviewId}/declaration`)
      .send({
        disposition,
        comment
      })
      .end(processResponse(() => {}));
  }

  reviseSubQuestion([reviewId, subQuestionId, answer]) {
    const questionToRevise = this.disclosure.questions.find(question => {
      return reviewId === question.reviewId;
    });
    const subQuestionToRevise = questionToRevise.subQuestions.find(subQuestion => {
      return subQuestion.id === subQuestionId;
    });

    if (subQuestionToRevise) {
      subQuestionToRevise.answer = {
        value: answer
      };
      questionToRevise.reviewedOn = new Date();
    }

    this.updateCanSubmit();

    createRequest().put(`/api/coi/pi-revise/${reviewId}/subquestion-answer/${subQuestionId}`)
      .send({
        answer: {
          value: answer
        }
      })
      .type('application/json')
      .end();
  }

  deleteAnswers([reviewId, toDelete]) {
    if (toDelete.length > 0) {
      createRequest().del(`/api/coi/pi-revise/${reviewId}/question-answers`)
        .send({
          toDelete
        })
        .type('application/json')
        .end();
    }
  }

  submit() {
    this.applicationState.showingCertification = true;
  }

  confirm(disclosureId) {
    createRequest().put(`/api/coi/pi-revise/${disclosureId}/submit`)
      .end(processResponse(() => {
        document.location = '/coi/';
      }));
  }

  addEntityAttachments([files, entityId]) {
    const entityToRevise = this.disclosure.entities.find(entity => {
      return entityId === entity.id;
    });

    if(!entityToRevise.files) {
      entityToRevise.files = [];
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('attachments', file);
    });

    formData.append('data', JSON.stringify({
      refId: entityToRevise.id,
      type: COIConstants.FILE_TYPE.FINANCIAL_ENTITY,
      disclosureId: entityToRevise.disclosureId
    }));

    createRequest().post('/api/coi/files')
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
    const entityToRevise = this.disclosure.entities.find(entity => {
      return entityId === entity.id;
    });
    const file = entityToRevise.files[index];

    createRequest().del(`/api/coi/files/${file.id}`)
    .end(processResponse((err) => {
      if (!err) {
        entityToRevise.files.splice(index, 1);
        entityToRevise.reviewedOn = new Date();
        entityToRevise.revised = 1;
        this.updateCanSubmit();
        this.emitChange();
      }
    }));
  }
}

export const PIReviewStore = alt.createStore(_PIReviewStore, 'PIReviewStore');
