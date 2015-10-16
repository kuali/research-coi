import PIReviewActions from '../actions/PIReviewActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import request from 'superagent';

class _PIReviewStore extends AutoBindingStore {
  constructor() {
    super(PIReviewActions);

    this.exportPublicMethods({
    });

    this.applicationState = {
    };
  }

  loadDisclosure(disclosureId) {
    request.get(`/api/coi/disclosure/${disclosureId}/pi-review-items`)
           .end((err, disclosure) => {
             if (!err) {
               this.disclosure = disclosure.body;

               if (this.disclosure.questions) {
                 this.disclosure.questions.forEach(question => {
                   if (question.question) {
                     question.question = JSON.parse(question.question);
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

               this.emitChange();
             }
           });
  }

  respond(params) {
    let questionToRespondTo = this.disclosure.questions.find(question => {
      return params.reviewId === question.reviewId;
    });
    if (questionToRespondTo) {
      questionToRespondTo.reviewedOn = new Date();
      questionToRespondTo.piResponse = {
        text: params.comment
      };
    }

    let entityToRespondTo = this.disclosure.entities.find(entity => {
      return params.reviewId === entity.reviewId;
    });
    if (entityToRespondTo) {
      entityToRespondTo.reviewedOn = new Date();
    }

    let declarationToRespondTo = this.disclosure.declarations.find(declaration => {
      return params.reviewId === declaration.reviewId;
    });
    if (declarationToRespondTo) {
      declarationToRespondTo.reviewedOn = new Date();
    }

    request.post(`/api/coi/pi-response/${params.reviewId}`)
      .send({
        comment: params.comment
      })
      .end(() => {
      });
  }

  revise(params) {
    let questionToRevise = this.disclosure.questions.find(question => {
      return params.reviewId === question.reviewId;
    });
    if (questionToRevise) {
      questionToRevise.answer = {
        value: params.newAnswer
      };
      questionToRevise.reviewedOn = new Date();
    }

    request.put(`/api/coi/pi-revise/${params.reviewId}`)
      .send({
        answer: params.newAnswer
      })
      .end();
  }

  reviseEntityQuestion(params) {
    let entityToRevise = this.disclosure.entities.find(entity => {
      return params.reviewId === entity.reviewId;
    });
    if (entityToRevise) {
      let theAnswer = entityToRevise.answers.find(answer => {
        return answer.questionId === params.questionId;
      });

      if (theAnswer) {
        theAnswer.answer = {
          value: params.newValue
        };
      }

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    request.put(`/api/coi/pi-revise/${params.reviewId}/entity-question/${params.questionId}`)
      .send({
        answer: params.newValue
      })
      .end();
  }

  addRelationship(params) {
    let entityToRevise = this.disclosure.entities.find(entity => {
      return params.reviewId === entity.reviewId;
    });
    if (entityToRevise) {
      if (entityToRevise.relationships === undefined) {
        entityToRevise.relationships = [];
      }
      entityToRevise.relationships.push({
        amount: '',
        comments: params.newRelationship.comments,
        finEntityId: entityToRevise.id,
        id: new Date().getTime(),
        person: '',
        relationship: '',
        type: ''
      });

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    request.post(`/api/coi/pi-revise/${params.reviewId}/entity-relationship`)
      .send(params.newRelationship)
      .end((err, relationships) => {
        if (!err) {
          entityToRevise.relationships = relationships.body;
          this.emitChange();
        }
      });
  }

  removeRelationship(params) {
    let entityToRevise = this.disclosure.entities.find(entity => {
      return params.entityId === entity.id;
    });
    if (entityToRevise) {
      entityToRevise.relationships = entityToRevise.relationships.filter(relationship => {
        return relationship.id !== params.relationshipId;
      });

      entityToRevise.reviewedOn = new Date();
      entityToRevise.revised = 1;
    }

    request.del(`/api/coi/pi-revise/${params.reviewId}/entity-relationship/${params.relationshipId}`)
      .end();
  }
}

export let PIReviewStore = alt.createStore(_PIReviewStore, 'PIReviewStore');
