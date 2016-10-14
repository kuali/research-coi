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

import {browserHistory} from 'react-router';
import {DisclosureActions} from '../actions/disclosure-actions';
import PIReviewActions from '../actions/pi-review-actions';
import alt from '../alt';
import {
  DISCLOSURE_STEP,
  INSTRUCTION_STEP,
  ARCHIVE_SORT_FIELD,
  SORT_DIRECTION,
  QUESTION_TYPE,
  DISCLOSURE_TYPE,
  EDITABLE_STATUSES,
  TMP_PLACEHOLDER,
  FILE_TYPE
} from '../../../coi-constants';
import {processResponse, createRequest} from '../http-utils';
import ConfigActions from '../actions/config-actions';
import ConfigStore from './config-store';

const cloneObject = original => {
  return JSON.parse(JSON.stringify(original));
};

function provided(value) {
  return (
    (value !== undefined && value !== null) &&
    (
      (typeof value === 'string' && value.length > 0) ||
      (typeof value !== 'string' && value !== 0)
    )
  );
}

function mapDisclosureToInstructionStep(step) {
  switch (step) {
    case DISCLOSURE_STEP.QUESTIONNAIRE:
      return INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE;
    case DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
      return INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE;
    case DISCLOSURE_STEP.ENTITIES:
      return INSTRUCTION_STEP.FINANCIAL_ENTITIES;
    case DISCLOSURE_STEP.PROJECTS:
      return INSTRUCTION_STEP.PROJECT_DECLARATIONS;
    case DISCLOSURE_STEP.CERTIFY:
      return INSTRUCTION_STEP.CERTIFICATION;
    default:
      return '';
  }
}

export function unSubmittedRelationshipStarted(potentialRelationship) {
  if (
    !potentialRelationship
  ) {
    return false;
  }

  const {personCd, comments, relationshipCd} = potentialRelationship;
  return provided(personCd) || provided(comments) || provided(relationshipCd);
}

export function entityRelationshipStepErrors(potentialRelationship, matrixTypes) {
  const errors = {};

  if (!potentialRelationship) {
    return errors;
  }

  const {
    personCd,
    comments,
    relationshipCd,
    typeCd,
    travel,
    amountCd
  } = potentialRelationship;

  if (!provided(personCd)) {
    errors.person = 'Required Field';
  }

  if (!provided(comments)) {
    errors.comment = 'Required Field';
  }

  if (!provided(relationshipCd)) {
    errors.relation = 'Required Field';
    return errors;
  }

  const matrixType = matrixTypes.find(type => type.typeCd === relationshipCd);
  if (matrixType === undefined) {
    throw new Error('Invalid relationshipCd');
  }

  if (matrixType.typeEnabled === 1 && !provided(typeCd)) {
    errors.type = 'Required Field';
  }

  if (matrixType.amountEnabled === 1) {
    if (matrixType.description === 'Travel') {
      if (!provided(travel.amount)) {
        errors.travelAmount = 'Required Field';
      } else if (isNaN(travel.amount)) {
        errors.travelAmount = 'Numeric Value Only';
      }
    } else if (!provided(amountCd)) {
      errors.amount = 'Required Field';
    }
  }

  if (matrixType.destinationEnabled === 1 && !provided(travel.destination)) {
    errors.travelDestination = 'Required Field';
  }

  if (matrixType.dateEnabled === 1) {
    if (!provided(travel.startDate)) {
      errors.travelStartDate = 'Required Field';
    }
    if (!provided(travel.endDate)) {
      errors.travelEndDate = 'Required Field';
    }
    if (
      travel.startDate &&
      travel.endDate &&
      travel.startDate > travel.endDate
    ) {
      errors.travelEndDate = 'Return date must be after departure date';
    }
  }

  if (matrixType.reasonEnabled === 1 && !provided(travel.reason)) {
    errors.travelReason = 'Required Field';
  }

  return errors;
}

export function areNoActiveEntities(entities) {
  return entities
    .filter(entity => entity.active === 1)
    .length === 0;
}

export function getYesNoYeses(answers, questions) {
  return answers.filter(answer => {
    return questions.find(question => question.id === answer.questionId).question.type === QUESTION_TYPE.YESNO
      && answer.answer.value === 'Yes';
  });
}

function recordAnswerToMultiple(target, question) {
  if (!target.answers) {
    target.answers = [];
  }

  const existingAnswer = target.answers.find(answer => {
    return answer.questionId === question.id;
  });

  if (existingAnswer) {
    if (question.checked) {
      if (!existingAnswer.answer.value.includes(question.answer.value)) {
        existingAnswer.answer.value.push(question.answer.value);
      }
    } else {
      const index = existingAnswer.answer.value.indexOf(question.answer.value);
      if (index > -1) {
        existingAnswer.answer.value.splice(index, 1);
      }
    }
  }
  else {
    const answers = [];
    answers.push(question.answer.value);
    const newAnswer = {questionId: question.id, answer: {value: answers}};
    target.answers.push(newAnswer);
  }
}

class _DisclosureStore {
  constructor() {
    this.bindActions(DisclosureActions);

    this.exportPublicMethods({
      getDisclosure: this.getDisclosure,
      entityNameStepErrors: this.entityNameStepErrors,
      entityNameStepComplete: this.entityNameStepComplete,
      entityInformationStepErrors: this.entityInformationStepErrors,
      entityInformationStepComplete: this.entityInformationStepComplete,
      entityRelationshipStepErrors: this.entityRelationshipStepErrors,
      entityRelationshipStepComplete: this.entityRelationshipStepComplete,
      entityRelationshipsAreSubmittable: this.entityRelationshipsAreSubmittable,
      enforceEntities: this.enforceEntities,
      canSkipEntities: this.canSkipEntities,
      warnActiveEntity: this.warnActiveEntity,
      getWorstDeclaration: this.getWorstDeclaration
    });

    // initialize state here
    this.disclosures = [];
    this.applicationState = {
      archiveFilter: '2',
      archiveQuery: '',
      archiveSortField: ARCHIVE_SORT_FIELD.START,
      archiveSortDirection: SORT_DIRECTION.DESCENDING,
      instructionsShowing: {},
      currentDisclosureState: {
        step: DISCLOSURE_STEP.QUESTIONNAIRE,
        question: 1,
        isCertified: false,
        disclosure: {
          id: -1,
          answers: []
        },
        visitedSteps: {}
      },
      newEntityFormStep: -1,
      activeEntityView: 1,
      declarationStates: {
        projects: {},
        entities: {},
        manual: {},
        travel: {}
      },
      declarationView: 0,
      entityStates: {},
      entityInProgress: {
        active: 1,
        answers: []
      },
      potentialRelationships: {
      },
      validatingEntityNameStep: false,
      validatingEntityInformationStep: false,
      validatingEntityRelationshipStep: false,
      returnToSummaryOnAnswer: false
    };

    this.loadProjects();

    this.entities = [];
    this.declarations = [];
    this.archivedDisclosures = [];
    this.disclosureDetail = undefined;
    this.disclosureSummariesForUser = [];
    this.disclosuresNeedingReview = [];
  }

  loadProjects() {
    createRequest()
      .get('/api/coi/projects')
      .query({filter: true})
      .end(processResponse((err, projects) => {
        if (!err) {
          this.projects = projects.body;
          this.emitChange();
        }
      }));
  }

  loadStatusOfDisclosure(id) {
    createRequest()
      .get(`/api/coi/disclosures/${id}`)
      .end(processResponse((err, disclosure) => {
        if (!err) {
          this.currentAnnualDisclosureStatus = disclosure.body.statusCd;
          this.emitChange();
        }
      }));
  }

  refreshArchivedDisclosures() {
    createRequest().get('/api/coi/archived-disclosures')
      .end(processResponse((err, disclosures) => {
        if (!err) {
          this.archivedDisclosures = disclosures.body;
          if (this.archivedDisclosures.length > 0) {
            this.loadStatusOfDisclosure(this.archivedDisclosures[0].disclosureId);
          }
          this.emitChange();
        }
      }));
  }

  loadArchivedDisclosures() {
    this.refreshArchivedDisclosures();
  }

  loadDisclosureDetail(id) {
    createRequest()
      .get(`/api/coi/disclosures/${id}`)
      .end(processResponse((err, disclosure) => {
        if (!err) {
          this.disclosureDetail = disclosure.body;
          this.emitChange();
        }
      }));
  }

  refreshDisclosureSummaries() {
    createRequest()
      .get('/api/coi/disclosure-user-summaries')
      .end(processResponse((discErrs, disclosures) => {
        if (!discErrs) {
          this.disclosureSummariesForUser = disclosures.body;
          this.emitChange();
        }
      }));

    createRequest()
      .get('/api/coi/reviewers/disclosures')
      .end(processResponse((reviewErrs, toReview) => {
        if (!reviewErrs) {
          this.disclosuresNeedingReview = toReview.body;
          this.emitChange();
        }
      }));
  }

  loadDisclosureSummaries() {
    this.refreshDisclosureSummaries();
  }

  loadDisclosureState(disclosureId) {
    const {config} = ConfigStore.getState();
    const hideInstructions = config.general.instructionsExpanded === false;
    this.applicationState.instructionsShowing[INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE] = !hideInstructions;
    this.applicationState.instructionsShowing[INSTRUCTION_STEP.FINANCIAL_ENTITIES] = !hideInstructions;
    this.applicationState.instructionsShowing[INSTRUCTION_STEP.PROJECT_DECLARATIONS] = !hideInstructions;
    this.applicationState.instructionsShowing[INSTRUCTION_STEP.CERTIFICATION] = !hideInstructions;

    return new Promise((resolve, reject) => {
      createRequest()
        .get(`/api/coi/disclosures/${disclosureId}/state`)
        .end(processResponse((err, state) => {
          if (err) {
            reject();
          }

          if (state.body) {
            this.applicationState.currentDisclosureState.step = state.body.step;
            this.applicationState.currentDisclosureState.question = state.body.question;
          }

          resolve();
        }));
    });
  }

  updateDisclosureState(disclosureId) {
    createRequest()
      .post(`/api/coi/disclosures/${disclosureId}/state`)
      .send({
        step: this.applicationState.currentDisclosureState.step,
        question: this.applicationState.currentDisclosureState.question
      })
      .type('application/json')
      .end(processResponse(() => {}));
  }

  loadDisclosureData(disclosureType) {
    if (disclosureType === DISCLOSURE_TYPE.ANNUAL) {
      createRequest()
        .get('/api/coi/disclosures/annual')
        .end(processResponse((err, disclosure) => {
          if (!err) {
            if (EDITABLE_STATUSES.includes(disclosure.body.statusCd)) {
              this.loadDisclosureState(disclosure.body.id)
                .then(() => {
                  this.applicationState.currentDisclosureState.disclosure = disclosure.body;
                  this.entities = disclosure.body.entities;
                  this.declarations = disclosure.body.declarations;
                  this.files = disclosure.body.files;

                  ConfigActions.loadConfig(disclosure.body.configId);
                  this.emitChange();
                });
            } else {
              window.location = '/coi';
            }
          }
        }));
    }
  }

  setCurrentDisclosureId(id) {
    this.applicationState.currentDisclosureState.disclosure.id = id;
  }

  changeArchiveFilter(newValue) {
    this.applicationState.archiveFilter = newValue;
  }

  changeArchivedQuery(newQuery) {
    this.applicationState.archiveQuery = newQuery;
  }

  toggleInstructions() {
    const instructionStep = mapDisclosureToInstructionStep(this.applicationState.currentDisclosureState.step);
    this.applicationState.instructionsShowing[instructionStep] = !this.applicationState.instructionsShowing[instructionStep];
  }

  submitQuestion(question) {
    const answer = this.answerQuestion(question);

    if (question.advance) {
      this.advanceQuestion();
    }

    let request;
    if (answer.id) {
      request = createRequest().put(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/question-answers/${answer.questionId}`); // eslint-disable-line max-len
    } else {
      request = createRequest().post(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/question-answers`);
    }
    request
      .send(answer)
      .type('application/json')
      .end(processResponse((err, res) => {
        if (!err) {
          answer.id = res.body.id;
          this.emitChange();
        }
      }));
  }

  answerQuestion(question) {
    if (!this.applicationState.currentDisclosureState.disclosure.answers) {
      this.applicationState.currentDisclosureState.disclosure.answers = [];
    }
    let answer = this.applicationState.currentDisclosureState.disclosure.answers.find(
      ans => ans.questionId === question.id
    );

    if (answer) {
      answer.answer.value = question.answer.value;
    }
    else {
      answer = {questionId: question.id, answer: question.answer};
      this.applicationState.currentDisclosureState.disclosure.answers.push(answer);
    }

    return answer;
  }

  answerMultiple(question) {
    const {disclosure} = this.applicationState.currentDisclosureState;
    recordAnswerToMultiple(disclosure, question);
  }

  advanceQuestion() {
    const {config} = ConfigStore.getState();
    const parentQuestions = config.questions.screening.filter(question => {
      return !question.parent;
    });

    if (this.applicationState.returnToSummaryOnAnswer || this.applicationState.currentDisclosureState.question >= parentQuestions.length) {
      this.applicationState.returnToSummaryOnAnswer = false;
      this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY;
      this.applicationState.currentDisclosureState.visitedSteps[DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY] = true;
    }
    else {
      this.applicationState.currentDisclosureState.question++;
    }

    this.updateDisclosureState(this.applicationState.currentDisclosureState.disclosure.id);
  }

  previousQuestion() {
    const {config} = ConfigStore.getState();
    const parentQuestions = config.questions.screening.filter(question => {
      return !question.parent;
    });
    switch (this.applicationState.currentDisclosureState.step) {
      case DISCLOSURE_STEP.QUESTIONNAIRE:
        if (this.applicationState.currentDisclosureState.question > 1) {
          this.applicationState.currentDisclosureState.question--;
        }
        break;
      case DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
        this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.QUESTIONNAIRE;
        this.applicationState.currentDisclosureState.question = parentQuestions.length;
        break;
      case DISCLOSURE_STEP.ENTITIES:
        this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY;
        break;
      case DISCLOSURE_STEP.PROJECTS:
        this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.ENTITIES;
        break;
      case DISCLOSURE_STEP.CERTIFY: {
        const activeEntitiesExists = this.entities.some(entity => {
          return entity.active;
        });
        if (activeEntitiesExists && this.projects.length > 0) {
          this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.PROJECTS;
        }
        else {
          this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.ENTITIES;
        }
        break;
      }
    }

    this.updateDisclosureState(this.applicationState.currentDisclosureState.disclosure.id);
  }

  setCurrentQuestion(newQuestionId) {
    this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.QUESTIONNAIRE;
    this.applicationState.currentDisclosureState.question = newQuestionId;
    this.applicationState.returnToSummaryOnAnswer = true;
  }

  answerEntityQuestion(question) {
    const entity = question.entityId ? this.getEntity(question.entityId) : this.applicationState.entityInProgress;

    if (!entity.answers) {
      entity.answers = [];
    }

    const existingAnswer = entity.answers.find(answer => {
      return answer.questionId === question.id;
    });

    if (existingAnswer) {
      existingAnswer.answer.value = question.answer.value;
    }
    else {
      const newAnswer = {questionId: question.id, answer: question.answer};
      entity.answers.push(newAnswer);
    }
  }

  answerEntityMultiple(question) {
    const entity = question.entityId ? this.getEntity(question.entityId) : this.applicationState.entityInProgress;
    recordAnswerToMultiple(entity, question);
  }

  addEntityAttachments([files, entityId]) {
    const entity = entityId ? this.getEntity(entityId) : this.applicationState.entityInProgress;
    if (!entity.files) {
      entity.files = [];
    }

    files.forEach(file => {
      entity.files.push(file);
    });
  }

  deleteEntityAttachment([index, entityId]) {
    const entity = entityId ? this.getEntity(entityId) : this.applicationState.entityInProgress;
    entity.files.splice(index, 1);
  }

  nextStep() {
    const {config} = ConfigStore.getState();
    switch (this.applicationState.currentDisclosureState.step) {
      case DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
        if (this.canSkipEntities(this.applicationState.currentDisclosureState.disclosure, config)) {
          this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.CERTIFY;
          break;
        }
        this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.ENTITIES;
        this.applicationState.currentDisclosureState.visitedSteps[DISCLOSURE_STEP.ENTITIES] = true;
        break;
      case DISCLOSURE_STEP.ENTITIES: {
        const activeEntitiesExists = this.entities.some(entity => {
          return entity.active;
        });
        if (activeEntitiesExists && this.projects.length > 0) {
          this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.PROJECTS;
          this.applicationState.currentDisclosureState.visitedSteps[DISCLOSURE_STEP.PROJECTS] = true;
        }
        else {
          this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.CERTIFY;
          this.applicationState.currentDisclosureState.visitedSteps[DISCLOSURE_STEP.CERTIFY] = true;
        }
        break;
      }
      case DISCLOSURE_STEP.PROJECTS:
        this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.CERTIFY;
        this.applicationState.currentDisclosureState.visitedSteps[DISCLOSURE_STEP.CERTIFY] = true;
        break;
    }
    this.updateDisclosureState(this.applicationState.currentDisclosureState.disclosure.id);
  }

  newEntityInitiated() {
    this.applicationState.newEntityFormStep = 0;
  }

  setInProgressEntityName(newNameValue) {
    this.applicationState.entityInProgress.name = newNameValue;
  }

  entityFormNextClicked(entityId) {
    if (entityId) {
      if (!this.applicationState.entityStates[entityId]) {
        this.applicationState.entityStates[entityId] = {};
      }
      this.applicationState.entityStates[entityId].formStep++;
    }
    else if (this.applicationState.newEntityFormStep < 2) {
      this.applicationState.newEntityFormStep++;
    }
  }

  entityFormBackClicked(entityId) {
    if (entityId) {
      if (!this.applicationState.entityStates[entityId]) {
        this.applicationState.entityStates[entityId] = {};
      }
      this.applicationState.entityStates[entityId].formStep--;
    }
    else if (this.applicationState.newEntityFormStep > 0) {
      this.applicationState.newEntityFormStep--;
    }
  }

  getEntity(id) {
    return this.entities.find(entity => {
      return entity.id === id;
    });
  }

  setEntityActiveStatus([active, id]) {
    const entity = id ? this.getEntity(id) : this.applicationState.entityInProgress;
    entity.active = active;
    const formData = new FormData();
    formData.append('entity', JSON.stringify(entity));
    createRequest()
      .put(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/financial-entities/${entity.id}`)
      .send(formData)
      .end(processResponse(() => {}));
  }

  getPotentialRelationship(entityId = 'new') {
    let relationship = this.applicationState.potentialRelationships[entityId];
    if (!relationship) {
      this.applicationState.potentialRelationships[entityId] = {
        personCd: '',
        relationshipCd: '',
        typeCd: '',
        amountCd: '',
        comments: '',
        travel: {}
      };
      relationship = this.applicationState.potentialRelationships[entityId];
    }
    return relationship;
  }

  setEntityRelationshipPerson([person, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    relationship.personCd = person;
  }

  setEntityRelationshipTravelAmount([amount, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    if (!relationship.travel) {
      relationship.travel = {};
    }

    relationship.travel.amount = amount;
  }

  setEntityRelationshipTravelDestination([destination, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    if (!relationship.travel) {
      relationship.travel = {};
    }

    relationship.travel.destination = destination;
  }

  setEntityRelationshipTravelStartDate([date, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    if (!relationship.travel) {
      relationship.travel = {};
    }

    relationship.travel.startDate = date;
  }

  setEntityRelationshipTravelEndDate([date, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    if (!relationship.travel) {
      relationship.travel = {};
    }

    relationship.travel.endDate = date;
  }

  setEntityRelationshipTravelReason([reason, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    if (!relationship.travel) {
      relationship.travel = {};
    }

    relationship.travel.reason = reason;
  }

  setEntityRelationshipRelation([relation, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);

    relationship.relationshipCd = relation;
    this.setEntityRelationshipType('', entityId);
    this.setEntityRelationshipAmount('', entityId);
  }

  setEntityRelationshipType([type, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    relationship.typeCd = type;
  }

  setEntityRelationshipAmount([amount, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    relationship.amountCd = amount;
  }

  setEntityRelationshipComment([comment, entityId]) {
    const relationship = this.getPotentialRelationship(entityId);
    relationship.comments = comment;
  }

  addEntityRelationship(entityId) {
    const {config} = ConfigStore.getState();
    const entity = entityId ? this.getEntity(entityId) : this.applicationState.entityInProgress;

    if (!entity.relationships) {
      entity.relationships = [];
    }

    let relation = this.applicationState.potentialRelationships[entityId];
    if (!relation) {
      relation = this.applicationState.potentialRelationships.new;
    }

    relation.id = `${TMP_PLACEHOLDER}${new Date().getTime()}`;
    const matrixType = config.matrixTypes.find(matrix => {
      return matrix.typeCd === relation.relationshipCd;
    });

    relation.amount = this.getDescriptionFromCode(relation.amountCd, matrixType.amountOptions);
    relation.type = this.getDescriptionFromCode(relation.typeCd, matrixType.typeOptions);
    relation.relationship = this.getDescriptionFromCode(relation.relationshipCd, config.matrixTypes);
    relation.person = this.getDescriptionFromCode(relation.personCd, config.relationshipPersonTypes);
    entity.relationships.push(relation);

    if (entityId) {
      delete this.applicationState.potentialRelationships[entityId];
    }
    else {
      delete this.applicationState.potentialRelationships.new;
    }
  }

  getDescriptionFromCode(typeCd, collection) {
    const desc = collection.find(type => {
      return type.typeCd === typeCd;
    });

    if (desc) {
      return desc.description;
    }
  }

  getCodeFromDescription(description, collection) {
    const code = collection.find(type => {
      return type.description === description;
    });

    if (code) {
      return code.typeCd;
    }
  }

  removeEntityRelationship([relationId, entityId]) {
    const entity = entityId ? this.getEntity(entityId) : this.applicationState.entityInProgress;

    entity.relationships = entity.relationships.filter((relationship) => {
      return relationship.id !== relationId;
    });
  }

  entityFormClosed(entity) {
    if (entity.id) {
      const potentialRelationship = this.applicationState.potentialRelationships[entity.id];
      if (potentialRelationship) {
        const personCd = potentialRelationship.personCd;
        if (personCd && personCd > 0) {
          this.addEntityRelationship(entity.id);
        }
      }

      const formData = new FormData();
      const existingFiles = [];
      if (entity.files && entity.files.length > 0) {
        entity.files.forEach(file => {
          if (file.preview) {
            formData.append('attachments', file);
          } else {
            existingFiles.push(file);
          }
        });
      }
      entity.files = existingFiles;
      formData.append('entity', JSON.stringify(entity));

      if (!this.applicationState.entityStates[entity.id]) {
        this.applicationState.entityStates[entity.id] = {};
      }

      if (this.applicationState.entityStates[entity.id].editing === true) {
        this.applicationState.entityStates[entity.id].formStep = -1;
        this.applicationState.entityStates[entity.id].editing = false;

        createRequest()
          .put(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/financial-entities/${entity.id}`)
          .send(formData)
          .end(processResponse((err, res) => {
            if (!err) {
              const index = this.entities.findIndex(existingEntity => {
                return existingEntity.id === res.body.id;
              });

              if (index !== -1) {
                this.entities[index] = res.body;
              }

              this.emitChange();
            }
          }));
      }
      else {
        this.applicationState.entityStates[entity.id].formStep = -1;
      }
    }
    else {
      this.applicationState.newEntityFormStep = -1;
      this.applicationState.entityInProgress = {
        active: 1,
        answers: []
      };
    }
  }

  saveInProgressEntity([entity, duringRevision]) {
    let potentialRelationship = this.applicationState.potentialRelationships[entity.id];
    if (!entity.id) {
      potentialRelationship = this.applicationState.potentialRelationships.new;
    }

    if (potentialRelationship) {
      const personCd = potentialRelationship.personCd;
      if (personCd && personCd > 0) {
        this.addEntityRelationship();
      }
    }

    if (!this.entities) {
      this.entities = [];
    }

    const formData = new FormData();
    if (entity.files && entity.files.length > 0) {
      entity.files.forEach(file => {
        formData.append('attachments', file);
      });
    }

    formData.append('entity', JSON.stringify(entity));
    formData.append('duringRevision', duringRevision);

    this.applicationState.entityInProgress = {
      active: 1,
      answers: []
    };

    this.applicationState.newEntityFormStep = -1;

    const disclosureId = this.applicationState.currentDisclosureState.disclosure.id;
    createRequest()
      .post(`/api/coi/disclosures/${disclosureId}/financial-entities`)
      .send(formData)
      .end(processResponse((err, res) => {
        if (!err) {
          this.entities.push(res.body);
          this.emitChange();

          if (duringRevision) {
            PIReviewActions.loadDisclosure(disclosureId);
          }
        }
      }));
  }

  changeActiveEntityView(newView) {
    this.applicationState.activeEntityView = newView;
  }

  updateEntityFormOpened(entityId) {
    if (entityId) {
      if (!this.applicationState.entityStates[entityId]) {
        this.applicationState.entityStates[entityId] = {};
      }
      this.applicationState.entityStates[entityId].formStep = 1;
      this.applicationState.entityStates[entityId].editing = false;
    }
    else {
      this.applicationState.newEntityFormStep = 0;
    }
  }

  editEntity(id) {
    if (!this.applicationState.entityStates[id]) {
      this.applicationState.entityStates[id] = {};
    }

    this.applicationState.entityStates[id].editing = true;
    this.applicationState.entityStates[id].snapshot = cloneObject(this.getEntity(id));
  }

  undoEntityChanges(snapshot) {
    const targetIndex = this.entities.findIndex(entity => {
      return entity.id === snapshot.id;
    });

    if (targetIndex >= 0) {
      this.entities[targetIndex] = snapshot;
    }
    delete this.applicationState.potentialRelationships[snapshot.id];
    this.applicationState.entityStates[snapshot.id].editing = false;
  }

  resetPotentialRelationship(id) {
    delete this.applicationState.potentialRelationships[id];
  }

  getDisclosure(id) {
    if (this.disclosures) {
      return this.disclosures.find(element => {
        return element.id === id;
      });
    }

    return undefined;
  }

  toggleDeclaration([entityId, type]) {
    let collectionToUse;
    switch (type) {
      case 'PROJECT':
        collectionToUse = this.applicationState.declarationStates.projects;
        break;
      case 'MANUAL':
        collectionToUse = this.applicationState.declarationStates.manual;
        break;
      default:
        collectionToUse = this.applicationState.declarationStates.entities;
        break;
    }

    if (collectionToUse[entityId]) {
      collectionToUse[entityId].open = !collectionToUse[entityId].open;
    }
    else {
      collectionToUse[entityId] = {
        open: true
      };
    }
  }

  changeDeclarationView(newView) {
    this.applicationState.declarationView = newView;
  }

  entityRelationChosen([relationType, finEntityId, projectId, typeCd]) {
    if (!this.declarations) {
      this.declarations = [];
    }

    let field;
    switch (relationType) {
      case 'PROJECT':
        field = 'projectId';
        break;
      case 'MANUAL':
        field = 'manualId';
        break;
    }

    // Look for existing relation
    const existing = this.declarations.find(declaration => {
      return declaration.finEntityId === finEntityId && declaration[field] === projectId;
    });

    if (existing) {
      existing.typeCd = typeCd;
      createRequest()
        .put(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/declarations/${existing.id}`)
        .send(existing)
        .type('application/json')
        .end(processResponse(() => {}));
    }
    else {
      const newRelation = {
        finEntityId,
        typeCd
      };
      newRelation[field] = projectId;
      createRequest()
        .post(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/declarations`)
        .send(newRelation)
        .type('application/json')
        .end(processResponse((err, res) => {
          if (!err) {
            this.declarations.push(res.body);
            this.emitChange();
          }
        }));
    }
  }

  declarationCommentedOn([relationType, finEntityId, projectId, comments]) {
    if (!this.declarations) {
      this.declarations = [];
    }

    let field;
    switch (relationType) {
      case 'PROJECT':
        field = 'projectId';
        break;
      case 'MANUAL':
        field = 'manualId';
        break;
    }

    // Look for existing relation
    const existing = this.declarations.find(declaration => {
      return declaration.finEntityId === finEntityId && declaration[field] === projectId;
    });

    if (existing) {
      existing.comments = comments;
      createRequest()
        .put(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/declarations/${existing.id}`)
        .send(existing)
        .type('application/json')
        .end(processResponse(() => {}));
    }
    else {
      const newRelation = {
        finEntityId,
        comments
      };
      newRelation[field] = projectId;
      createRequest()
        .post(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/declarations`)
        .send(newRelation)
        .type('application/json')
        .end(processResponse((err, res) => {
          if (!err) {
            this.declarations.push(res.body);
            this.emitChange();
          }
        }));
    }
  }

  setAllForEntity([finEntityId, typeCd]) {
    this.projects.forEach(project => {
      this.entityRelationChosen([
        'PROJECT',
        finEntityId,
        project.id,
        typeCd
      ]);
    });
  }

  setAllForProject([relationType, projectId, typeCd]) {
    this.entities.forEach(entity => {
      this.entityRelationChosen([
        relationType,
        entity.id,
        projectId,
        typeCd
      ]);
    });
  }

  resetDisclosure() {
    this.applicationState.currentDisclosureState.isCertified = false;
    this.applicationState.currentDisclosureState.step = DISCLOSURE_STEP.QUESTIONNAIRE;
    this.applicationState.currentDisclosureState.visitedSteps = {};
    this.applicationState.currentDisclosureState.question = 1;
    this.applicationState.entityInProgress = {
      active: 1,
      answers: []
    };
    this.applicationState.entityStates = {};
    this.projects.forEach(project => {
      project.new = false;
    });
    this.updateDisclosureState(this.applicationState.currentDisclosureState.disclosure.id);
  }

  toggleConfirmationMessage() {
    this.applicationState.confirmationShowing = !this.applicationState.confirmationShowing;
  }

  manualTypeSelected() {
    this.applicationState.manualStep = 2;
  }

  saveManualEvent([id, title, sponsor, role, amount, projectType, startDate, endDate]) {
    const disclosure = this.applicationState.currentDisclosureState.disclosure;
    if (disclosure) {
      disclosure.amount = amount;
      disclosure.enddate = endDate;
      disclosure.projectId = id;
      disclosure.projectType = projectType;
      disclosure.role = role;
      disclosure.sponsor = sponsor;
      disclosure.startdate = startDate;
      disclosure.title = title;
    }
  }

  doneEditingManualEvent() {
    this.applicationState.manualStep = 3;
  }

  jumpToStep(step) {
    this.applicationState.currentDisclosureState.step = step;
    this.applicationState.currentDisclosureState.visitedSteps[step] = true;
  }

  setArchiveSort([field, direction]) {
    this.applicationState.archiveSortField = field;
    this.applicationState.archiveSortDirection = direction;
  }

  entityNameStepErrors() {
    const storeState = this.getState();
    const errors = {};

    if (storeState.applicationState.entityInProgress.name === undefined ||
        storeState.applicationState.entityInProgress.name.length === 0) {
      errors.name = 'Required Field';
    }

    return errors;
  }

  entityNameStepComplete() {
    const errors = this.entityNameStepErrors();

    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  }

  entityInformationStepErrors(entityId) {
    const errors = [];

    const storeState = this.getState();
    let entity;
    if (entityId) {
      entity = storeState.entities.find(ent => {
        return ent.id === entityId;
      });
    }
    else {
      entity = storeState.applicationState.entityInProgress;
    }

    const {config} = ConfigStore.getState();
    config.questions.entities.forEach(question => {
      const answer = entity.answers.find(a => {
        return a.questionId === question.id;
      });

      let value;
      if (answer) {
        value = answer.answer.value;
      }

      if (question.question.type === QUESTION_TYPE.MULTISELECT && question.question.requiredNumSelections > 1) {
        if (value instanceof Array) {
          if (value.length < question.question.requiredNumSelections) {
            errors.push(question.id);
          }
        } else {
          errors.push(question.id);
        }
      } else if (!value) {
        errors.push(question.id);
      }
    });

    return errors;
  }

  entityInformationStepComplete(entityId) {
    const errors = this.entityInformationStepErrors(entityId);

    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  }

  entityRelationshipStepErrors(entityId = 'new') {
    const {config} = ConfigStore.getState();
    return entityRelationshipStepErrors(
      this.getState().applicationState.potentialRelationships[entityId],
      config.matrixTypes
    );
  }

  entityRelationshipStepComplete(entityId) {
    const errors = this.entityRelationshipStepErrors(entityId);

    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  }

  entityRelationshipsAreSubmittable(id) {
    const storeState = this.getState();
    let entity;
    if (id) {
      entity = storeState.entities.find(ent => ent.id === id);
    }
    else {
      entity = storeState.applicationState.entityInProgress;
    }

    const atLeastOneRelationshipAdded = () => {
      return entity.relationships && entity.relationships.length > 0;
    };

    if (atLeastOneRelationshipAdded()) {
      let potentialRelationship = storeState.applicationState.potentialRelationships[id];
      if (!potentialRelationship) {
        potentialRelationship = storeState.applicationState.potentialRelationships.new;
      }
      if (unSubmittedRelationshipStarted(potentialRelationship)) {
        return this.entityRelationshipStepComplete(id);
      }

      return true;
    }

    return this.entityRelationshipStepComplete(id);
  }

  turnOnValidation(step) {
    switch (step) {
      case 0:
        this.applicationState.validatingEntityNameStep = true;
        break;
      case 1:
        this.applicationState.validatingEntityInformationStep = true;
        break;
      case 2:
        this.applicationState.validatingEntityRelationshipStep = true;
        break;
    }
  }

  turnOffValidation(step) {
    switch (step) {
      case 0:
        this.applicationState.validatingEntityNameStep = false;
        break;
      case 1:
        this.applicationState.validatingEntityInformationStep = false;
        break;
      case 2:
        this.applicationState.validatingEntityRelationshipStep = false;
        break;
    }
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
      refId: this.applicationState.currentDisclosureState.disclosure.id,
      type: FILE_TYPE.DISCLOSURE,
      disclosureId: this.applicationState.currentDisclosureState.disclosure.id
    }));

    createRequest()
      .post('/api/coi/files')
      .send(formData)
      .end(processResponse((err, res) => {
        if (!err) {
          for (const fileData of res.body) {
            this.files.push(fileData);
          }

          PIReviewActions.loadDisclosure(this.applicationState.currentDisclosureState.disclosure.id);
          this.emitChange();
        }
      }));
  }

  deleteDisclosureAttachment(id) {
    const index = this.files.findIndex(f => f.id === parseInt(id));

    createRequest().del(`/api/coi/files/${id}`)
      .end(processResponse((err) => {
        if (!err) {
          this.files.splice(index, 1);
          this.emitChange();
          PIReviewActions.loadDisclosure(this.applicationState.currentDisclosureState.disclosure.id);
        }
      }));
  }

  certify(value) {
    this.applicationState.currentDisclosureState.isCertified = value;
  }

  submitDisclosure() {
    createRequest()
      .put(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/submit`)
      .end(processResponse(err => {
        if (!err) {
          this.resetDisclosure();
          this.toggleConfirmationMessage();
          // this.emitChange();
          browserHistory.replace('/coi/dashboard');
        }
      }));
  }

  deleteAnswersTo(toDelete) {
    const answerObject = this.applicationState.currentDisclosureState.disclosure.answers;
    if (answerObject) {
      this.applicationState.currentDisclosureState.disclosure.answers = answerObject.filter(answer => {
        return !toDelete.includes(answer.questionId);
      });
    }

    if (toDelete.length > 0) {
      createRequest()
        .del(`/api/coi/disclosures/${this.applicationState.currentDisclosureState.disclosure.id}/question-answers`)
        .send({
          toDelete
        })
        .type('application/json')
        .end(processResponse(() => {}));
    }
  }

  enforceEntities(disclosure, config) {
    return getYesNoYeses(disclosure.answers, config.questions.screening).length > 0 &&
      areNoActiveEntities(disclosure.entities) &&
      config.general.enforceFinancialEntities;
  }

  canSkipEntities(disclosure, config) {
    return areNoActiveEntities(disclosure.entities) &&
      getYesNoYeses(disclosure.answers, config.questions.screening).length === 0 &&
      config.general.skipFinancialEntities;
  }

  warnActiveEntity(disclosure, config) {
    return !areNoActiveEntities(disclosure.entities) &&
        getYesNoYeses(disclosure.answers, config.questions.screening).length === 0 &&
        config.general.skipFinancialEntities;
  }

  setStateForTest(data) {
    this[data.key] = data.value;
  }

  getWorstDeclaration(declarations, declarationTypes) {
    const usedDeclarationType = declarations.map(declaration => {
      const declarationType = declarationTypes.find(type => {
        return String(type.typeCd) === String(declaration.typeCd);
      });
      return declarationType;
    });

    usedDeclarationType.sort((a,b) => {
      return a.order - b.order;
    });

    if (usedDeclarationType[0]) {
      return usedDeclarationType[0].description;
    }
    return undefined;
  }
}

export const DisclosureStore = alt.createStore(_DisclosureStore, 'DisclosureStore');
