import PIReviewActions from '../actions/PIReviewActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import request from 'superagent';
import {COIConstants} from '../../../COIConstants';

class _PIReviewStore extends AutoBindingStore {
  constructor() {
    super(PIReviewActions);

    this.exportPublicMethods({
    });

    this.applicationState = {
    };
  }

  loadDisclosure(disclosureId) {
    request.get('/api/coi/disclosure/' + disclosureId + '/pi-review-items')
           .end((err, disclosure) => {
             if (!err) {
               this.disclosure = disclosure.body;
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

    request.post('/api/coi/pi-response/' + params.reviewId)
      .send({
        comment: params.comment
      })
      .end(() => {
      });
  }
}

export let PIReviewStore = alt.createStore(_PIReviewStore, 'PIReviewStore');