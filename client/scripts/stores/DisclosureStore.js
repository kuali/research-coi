import {DisclosureActions} from '../actions/DisclosureActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import request from 'superagent';
import {COIConstants} from '../../../COIConstants';

let cloneObject = original => {
  return JSON.parse(JSON.stringify(original));
};

class _DisclosureStore extends AutoBindingStore {
  constructor() {
    super(DisclosureActions);

    this.exportPublicMethods({
      getDisclosure: this.getDisclosure,
      entityNameStepErrors: this.entityNameStepErrors,
      entityNameStepComplete: this.entityNameStepComplete,
      entityInformationStepErrors: this.entityInformationStepErrors,
      entityInformationStepComplete: this.entityInformationStepComplete,
      entityRelationshipStepErrors: this.entityRelationshipStepErrors,
      entityRelationshipStepComplete: this.entityRelationshipStepComplete,
      entityIsSubmittable: this.entityIsSubmittable
    });

    // initialize state here
    this.disclosures = [];

    this.applicationState = {
      archiveFilter: 'ALL',
      archiveQuery: '',
      archiveSortField: COIConstants.ARCHIVE_SORT_FIELD.START,
      archiveSortDirection: COIConstants.SORT_DIRECTION.DESCENDING,
      instructionsShowing: false,
      currentDisclosureState: {
        step: COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE,
        question: 1,
        isCertified: false,
        disclosure: {
          id: 222,
          answers: []
        }
      },
      newEntityFormStep: -1,
      activeEntityView: COIConstants.DISCLOSURE_STATUS.ACTIVE,
      declarationStates: {
        projects: {},
        entities: {},
        manual: {},
        travel: {}
      },
      declarationView: 0,
      entityStates: {},
      entityInProgress: {
        active: 1
      },
      potentialRelationship: {
        personCd: '',
        relationshipCd: '',
        typeCd: '',
        amountCd: '',
        comments: ''
      },
      validatingEntityNameStep: false,
      validatingEntityInformationStep: false,
      validatingEntityRelationshipStep: false
    };

    this.projects = [];

    this.entities = [];
    this.declarations = [];
    this.archivedDisclosures = [];
    this.archivedDisclosureDetail = undefined;
    this.disclosureSummariesForUser = [];
  }

  refreshArchivedDisclosures() {
    request.get('/api/coi/disclosures/archived')
           .end((err, disclosures) => {
             if (!err) {
               this.archivedDisclosures = disclosures.body;
               this.emitChange();
             }
           });
  }

  loadArchivedDisclosures() {
    this.refreshArchivedDisclosures();
  }

  loadArchivedDisclosureDetail(id) {
    request.get('/api/coi/disclosures/' + id)
           .end((err, disclosure) => {
             if (!err) {
               this.archivedDisclosureDetail = disclosure.body;
               this.emitChange();
             }
           });
  }

  refreshDisclosureSummaries() {
    request.get('/api/coi/disclosure-user-summaries')
           .end((err, disclosures) => {
             if (!err) {
               this.disclosureSummariesForUser = disclosures.body;
               this.emitChange();
             }
           });
  }

  loadDisclosureSummaries() {
    this.refreshDisclosureSummaries();
  }

  loadDisclosureData(disclosureType) {
    if (disclosureType === 'Annual') {
      request.get('/api/coi/disclosures/annual')
      .end((err, disclosure) => {
        if (!err) {
          this.applicationState.currentDisclosureState.disclosure = disclosure.body;
          this.entities = disclosure.body.entities;
          this.projects = this.populateSponsorNames(disclosure.body.projects);
          this.declarations = disclosure.body.declarations;
          this.emitChange();
        }
      });
    }
  }

  populateSponsorNames(projects) {
    return projects.map(project =>{
      project.sponsor = this.getSponsorName(project.sponsorCd);
      return project;
    });
  }

  getSponsorName(sponsorCd) {
    switch (sponsorCd) {
      case '000100': return 'Air Force';
      case '000340': return 'NIH';
      case '000500': return 'NSF';
    }
  }

  changeArchiveFilter(newValue) {
    this.applicationState.archiveFilter = newValue;
  }

  changeArchivedQuery(newQuery) {
    this.applicationState.archiveQuery = newQuery;
  }

  toggleInstructions() {
    this.applicationState.instructionsShowing = !this.applicationState.instructionsShowing;
  }

  submitQuestion(question) {
    if (!this.applicationState.currentDisclosureState.disclosure.answers) {
      this.applicationState.currentDisclosureState.disclosure.answers = [];
    }
    let answer = this.applicationState.currentDisclosureState.disclosure.answers.find(ans => {
      return ans.questionId === question.id;
    });

    if (answer) {
      answer.answer.value = question.answer.value;
    } else {
      answer = {questionId: question.id, answer: question.answer};
    }

    if (answer.id) {
      request.post('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/question/answer')
      .send(answer)
      .type('application/json')
      .end((err, res)=>{
        if (!err) {
          answer = res.body;
          this.emitChange();
        }
      });
    } else {
      request.put('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/question/answer')
      .send(answer)
      .type('application/json')
      .end((err, res)=>{
        if (!err ) {
          this.applicationState.currentDisclosureState.disclosure.answers.push(res.body);
          this.emitChange();
        }
      });
    }
  }

  answerQuestion(question) {
    if (!this.applicationState.currentDisclosureState.disclosure.answers) {
      this.applicationState.currentDisclosureState.disclosure.answers = [];
    }
    let existingAnswer = this.applicationState.currentDisclosureState.disclosure.answers.find(answer => {
      return answer.questionId === question.id;
    });
    if (existingAnswer) {
      existingAnswer.answer.value = question.answer.value;
    }
    else {
      let newAnswer = {questionId: question.id, answer: question.answer};
      this.applicationState.currentDisclosureState.disclosure.answers.push(newAnswer);
    }
  }

  answerMultiple(question) {
    if (!this.applicationState.currentDisclosureState.disclosure.answers) {
      this.applicationState.currentDisclosureState.disclosure.answers = [];
    }
    let existingAnswer = this.applicationState.currentDisclosureState.disclosure.answers.find(answer => {
      return answer.questionId === question.id;
    });
    if (existingAnswer) {
      if (question.checked) {
        if (!existingAnswer.answer.value.includes(question.answer.value)) {
          existingAnswer.answer.value.push(question.answer.value);
        }
      } else {
        let index = existingAnswer.answer.value.indexOf(question.answer.value);
        if (index > -1) {
          existingAnswer.answer.value.splice(index, 1);
        }
      }
    }
    else {
      let answers = [];
      answers.push(question.answer.value);
      let newAnswer = {questionId: question.id, answer: {value: answers}};
      this.applicationState.currentDisclosureState.disclosure.answers.push(newAnswer);
    }
  }

  advanceQuestion() {
    let parentQuestions = window.config.questions.screening.filter(question=>{
      return !question.parent;
    });

    if (this.applicationState.currentDisclosureState.question >= parentQuestions.length) {
      this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY;
    }
    else {
      this.applicationState.currentDisclosureState.question++;
    }
  }

  previousQuestion() {
    let parentQuestions = window.config.questions.screening.filter(question=>{
      return !question.parent;
    });
    switch (this.applicationState.currentDisclosureState.step) {
      case COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE:
        if (this.applicationState.currentDisclosureState.question > 1) {
          this.applicationState.currentDisclosureState.question--;
        }
        break;
      case COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
        this.applicationState.currentDisclosureState.question = parentQuestions.length;
        break;
      case COIConstants.DISCLOSURE_STEP.ENTITIES:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY;
        break;
      case COIConstants.DISCLOSURE_STEP.PROJECTS:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.ENTITIES;
        break;
      case COIConstants.DISCLOSURE_STEP.CERTIFY:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.PROJECTS;
        break;
    }
  }

  setCurrentQuestion(newQuestionId) {
    this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
    this.applicationState.currentDisclosureState.question = newQuestionId;
  }

  nextStep() {
    switch (this.applicationState.currentDisclosureState.step) {
      case COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.ENTITIES;
        break;
      case COIConstants.DISCLOSURE_STEP.ENTITIES:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.PROJECTS;
        break;
      case COIConstants.DISCLOSURE_STEP.PROJECTS:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.CERTIFY;
        break;
    }
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
    else {
      if (this.applicationState.newEntityFormStep < 2) {
        this.applicationState.newEntityFormStep++;
      }
    }
  }

  entityFormBackClicked(entityId) {
    if (entityId) {
      if (!this.applicationState.entityStates[entityId]) {
        this.applicationState.entityStates[entityId] = {};
      }
      this.applicationState.entityStates[entityId].formStep--;
    }
    else {
      if (this.applicationState.newEntityFormStep > 0) {
        this.applicationState.newEntityFormStep--;
      }
    }
  }

  getEntity(id) {
    return this.entities.find(entity => {
      return entity.id === id;
    });
  }

  setEntityActiveStatus(params) {
    let entity = params.id ? this.getEntity(params.id) : this.applicationState.entityInProgress;
    entity.active = params.active;
    request.post('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/financial-entity')
    .send(entity)
    .type('application/json')
    .end();
  }

  setEntityType(params) {
    let entity = params.id ? this.getEntity(params.id) : this.applicationState.entityInProgress;
    entity.type = params.type;
  }

  setEntityPublic(params) {
    let entity = params.id ? this.getEntity(params.id) : this.applicationState.entityInProgress;
    entity.isPublic = params.isPublic;
  }

  setEntityIsSponsor(params) {
    let entity = params.id ? this.getEntity(params.id) : this.applicationState.entityInProgress;
    entity.isSponsor = params.isSponsor;
  }

  setEntityDescription(params) {
    let entity = params.id ? this.getEntity(params.id) : this.applicationState.entityInProgress;
    entity.description = params.description;
  }

  setEntityRelationshipPerson(personCd) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    this.applicationState.potentialRelationship.personCd = personCd;
  }

  setEntityRelationshipRelation(relationshipCd) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    this.applicationState.potentialRelationship.relationshipCd = relationshipCd;
    this.setEntityRelationshipType('');
    this.setEntityRelationshipAmount('');
  }

  setEntityRelationshipType(typeCd) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    this.applicationState.potentialRelationship.typeCd = typeCd;
  }

  setEntityRelationshipAmount(amountCd) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    this.applicationState.potentialRelationship.amountCd = amountCd;
  }

  setEntityRelationshipComment(comment) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    this.applicationState.potentialRelationship.comments = comment;
  }

  addEntityRelationship(entityId) {
    let entity = entityId ? this.getEntity(entityId) : this.applicationState.entityInProgress;

    if (!entity.relationships) {
      entity.relationships = [];
    }

    let relation = this.applicationState.potentialRelationship;

    let matrixType = window.config.matrixTypes.find(matrix=>{
      return matrix.typeCd === relation.relationshipCd;
    });

    relation.amount = this.getDescriptionFromCode(relation.amountCd, matrixType.amountOptions);
    relation.type = this.getDescriptionFromCode(relation.typeCd, matrixType.typeOptions);
    relation.relationship = this.getDescriptionFromCode(relation.relationshipCd, window.config.matrixTypes);
    relation.person = this.getDescriptionFromCode(relation.personCd, window.config.relationshipPersonTypes);
    entity.relationships.push(relation);

    this.applicationState.potentialRelationship = {
      personCd: '',
      person: '',
      relationship: '',
      relationshipCd: '',
      type: '',
      typeCd: '',
      amount: '',
      amountCd: '',
      comments: ''
    };
  }

  getDescriptionFromCode(typeCd, collection) {
    let desc = collection.find(type =>{
      return type.typeCd === typeCd;
    });

    if(desc) {
      return desc.description;
    }
  }

  getCodeFromDescription(description, collection) {
    let code = collection.find(type =>{
      return type.description === description;
    });

    if(code) {
      return code.typeCd;
    }
  }

  removeEntityRelationship(params) {
    let relationId = params.relationId;
    let entity = params.entityId ? this.getEntity(params.entityId) : this.applicationState.entityInProgress;

    entity.relationships = entity.relationships.filter((relationship) => {
      return relationship.id !== relationId;
    });
  }

  entityFormClosed(entity) {
    if (entity.id) {
      if (this.applicationState.potentialRelationship.personCd.length > 0) {
        this.addEntityRelationship(entity.id);
      }

      if (this.applicationState.entityStates[entity.id].editing === true) {
        request.post('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/financial-entity')
        .send(entity)
        .type('application/json')
        .end((err, res) => {
          if (!err) {

            let index = this.entities.findIndex(existingEntity => {
              return existingEntity.id === res.body.id;
            });

            if (index !== -1) {
              this.entities[index] = res.body;
            }

            if (!this.applicationState.entityStates[entity.id]) {
              this.applicationState.entityStates[entity.id] = {};
            }

            this.applicationState.entityStates[entity.id].formStep = -1;
            this.applicationState.entityStates[entity.id].editing = false;
            this.emitChange();
          }
        });
      } else {
        if (!this.applicationState.entityStates[entity.id]) {
          this.applicationState.entityStates[entity.id] = {};
        }

        this.applicationState.entityStates[entity.id].formStep = -1;
        this.applicationState.entityStates[entity.id].editing = false;
      }
    }
    else {
      this.applicationState.newEntityFormStep = -1;
      this.applicationState.entityInProgress = {
        active: 1
      };
    }
  }

  saveInProgressEntity(entity) {
    if (this.applicationState.potentialRelationship.personCd.length > 0) {
      this.addEntityRelationship();
    }

    if (!this.entities) {
      this.entities = [];
    }

    request.put('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/financial-entity')
    .send(entity)
    .type('application/json')
    .end((err, res) => {
      if (!err) {
        this.entities.push(res.body);

        this.applicationState.entityInProgress = {
          active: 1
        };

        this.applicationState.newEntityFormStep = -1;

        this.emitChange();
      }
    });
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
    let targetIndex = this.entities.findIndex(entity => {
      return entity.id === snapshot.id;
    });

    if (targetIndex >= 0) {
      this.entities[targetIndex] = snapshot;
    }
    this.applicationState.entityStates[snapshot.id].editing = false;
  }

  getDisclosure(id) {
    if (this.disclosures) {
      return this.disclosures.find(element => {
        return element.id === id;
      });
    }
    else {
      return undefined;
    }
  }

  toggleDeclaration(params) {
    let collectionToUse;
    switch (params.type) {
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

    if (collectionToUse[params.entityId]) {
      collectionToUse[params.entityId].open = !collectionToUse[params.entityId].open;
    }
    else {
      collectionToUse[params.entityId] = {
        open: true
      };
    }
  }

  changeDeclarationView(newView) {
    this.applicationState.declarationView = newView;
  }

  entityRelationChosen(params) {
    if (!this.declarations) {
      this.declarations = [];
    }

    let field;
    switch (params.relationType) {
      case 'PROJECT':
        field = 'projectId';
        break;
      case 'MANUAL':
        field = 'manualId';
        break;
    }

    // Look for existing relation
    let existing = this.declarations.find(declaration => {
      return declaration.finEntityId === params.finEntityId && declaration[field] === params.projectId;
    });

    if (existing) {
      existing.typeCd = params.typeCd;
      request.post('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/declaration')
      .send(existing)
      .type('application/json')
      .end();
    }
    else {
      let newRelation = {
        finEntityId: params.finEntityId,
        typeCd: params.typeCd
      };
      newRelation[field] = params.projectId;
      request.put('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/declaration')
      .send(newRelation)
      .type('application/json')
      .end((err, res) => {
        if (!err) {
          this.declarations.push(res.body);
          this.emitChange();
        }
      });
    }
  }

  declarationCommentedOn(params) {
    if (!this.declarations) {
      this.declarations = [];
    }

    let field;
    switch (params.relationType) {
      case 'PROJECT':
        field = 'projectId';
        break;
      case 'MANUAL':
        field = 'manualId';
        break;
    }

    // Look for existing relation
    let existing = this.declarations.find(declaration => {
      return declaration.finEntityId === params.finEntityId && declaration[field] === params.projectId;
    });

    if (existing) {
      existing.comments = params.comments;
      request.post('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/declaration')
      .send(existing)
      .type('application/json')
      .end();
    }
    else {
      let newRelation = {
        finEntityId: params.finEntityId,
        comments: params.comments
      };
      newRelation[field] = params.projectId;
      request.put('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/declaration')
      .send(newRelation)
      .type('application/json')
      .end((err, res) => {
        if (!err) {
          this.declarations.push(res.body);
          this.emitChange();
        }
      });
    }
  }

  setAllForEntity(params) {
    this.projects.forEach(project => {
      this.entityRelationChosen({
        relationType: 'PROJECT',
        finEntityId: params.finEntityId,
        projectId: project.projectId,
        typeCd: params.newValue
      });
    });
  }

  setAllForProject(params) {
    this.entities.forEach(entity => {
      this.entityRelationChosen({
        relationType: params.type,
        finEntityId: entity.id,
        projectId: params.projectId,
        typeCd: params.newValue
      });
    });
  }

  resetDisclosure() {
    this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
    this.applicationState.currentDisclosureState.question = 1;
    this.applicationState.entityInProgress = {
      active: 1
    };
    this.applicationState.entityStates = {};
  }

  toggleConfirmationMessage() {
    this.applicationState.confirmationShowing = !this.applicationState.confirmationShowing;
  }

  manualTypeSelected() {
    this.applicationState.manualStep = 2;
  }

  saveManualEvent(params) {
    let disclosure = this.applicationState.currentDisclosureState.disclosure;
    if (disclosure) {
      disclosure.amount = params.amount;
      disclosure.enddate = params.endDate;
      disclosure.projectId = params.id;
      disclosure.projectType = params.projectType;
      disclosure.role = params.role;
      disclosure.sponsor = params.sponsor;
      disclosure.startdate = params.startDate;
      disclosure.title = params.title;
    }
  }

  doneEditingManualEvent() {
    this.applicationState.manualStep = 3;
  }

  jumpToStep(step) {
    this.applicationState.currentDisclosureState.step = step;
  }

  setArchiveSort(params) {
    this.applicationState.archiveSortField = params.field;
    this.applicationState.archiveSortDirection = params.direction;
  }

  entityNameStepErrors() {
    const storeState = this.getState();
    let errors = {};

    if (storeState.applicationState.entityInProgress.name === undefined ||
        storeState.applicationState.entityInProgress.name.length === 0) {
      errors.name = 'Required Field';
    }

    return errors;
  }

  entityNameStepComplete() {
    let errors = this.entityNameStepErrors();

    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  }

  entityInformationStepErrors() {
    const storeState = this.getState();
    let errors = {};

    if (storeState.applicationState.entityInProgress.type === undefined || storeState.applicationState.entityInProgress.type.length === 0) {
      errors.type = 'Required Field';
    }
    if (storeState.applicationState.entityInProgress.isPublic === undefined || storeState.applicationState.entityInProgress.isPublic.length === 0) {
      errors.isPublic = 'Required Field';
    }
    if (storeState.applicationState.entityInProgress.isSponsor === undefined || storeState.applicationState.entityInProgress.isSponsor.length === 0) {
      errors.isSponsor = 'Required Field';
    }
    if (storeState.applicationState.entityInProgress.description === undefined || storeState.applicationState.entityInProgress.description.length === 0) {
      errors.description = 'Required Field';
    }

    return errors;
  }

  entityInformationStepComplete() {
    let errors = this.entityInformationStepErrors();

    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  }

  entityRelationshipStepErrors() {
    const storeState = this.getState();
    let errors = {};

    let potentialRelationship = storeState.applicationState.potentialRelationship;
    if (potentialRelationship.personCd === undefined || potentialRelationship.personCd.length === 0) {
      errors.person = 'Required Field';
    }

    if (potentialRelationship.comments === undefined || potentialRelationship.comments.length === 0) {
      errors.comment = 'Required Field';
    }

    let matrixType = window.config.matrixTypes.find(type=>{
      return type.typeCd === potentialRelationship.relationshipCd;
    });


    if (potentialRelationship.relationshipCd !== undefined && potentialRelationship.relationshipCd.length !== 0) {
      if (matrixType.typeEnabled === 1) {
        if (potentialRelationship.typeCd === undefined || potentialRelationship.typeCd.length === 0) {
          errors.type = 'Required Field';
        }
      }

      if (matrixType.amountEnabled === 1) {
        if (potentialRelationship.amountCd === undefined || potentialRelationship.amountCd.length === 0) {
          errors.amount = 'Required Field';
        }
      }
    }
    else {
      errors.relation = 'Required Field';
    }

    return errors;
  }

  entityRelationshipStepComplete() {
    let errors = this.entityRelationshipStepErrors();

    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  }

  entityIsSubmittable(id) {
    const storeState = this.getState();
    let entity;
    if (id) {
      entity = storeState.entities.find(ent => {
        return ent.id === id;
      });
    }
    else {
      entity = storeState.applicationState.entityInProgress;
    }

    let atLeastOneRelationshipAdded = () => {
      return entity.relationships && entity.relationships.length > 0;
    };

    let unSubmittedRelationshipStarted = () => {
      let potentialRelationship = storeState.applicationState.potentialRelationship;
      return (potentialRelationship.personCd && potentialRelationship.personCd.length > 0) ||
          (potentialRelationship.comments && potentialRelationship.comments.length > 0) ||
          (potentialRelationship.relationshipCd && potentialRelationship.relationshipCd.length > 0);
    };

    if (atLeastOneRelationshipAdded()) {
      if (unSubmittedRelationshipStarted()) {
        return this.entityRelationshipStepComplete();
      }
      else {
        return true;
      }
    }
    else {
      return this.entityRelationshipStepComplete();
    }
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

  certify(value) {
    this.applicationState.currentDisclosureState.isCertified = value;
  }

  submitDisclosure() {
    request.post('/api/coi/disclosure/' + this.applicationState.currentDisclosureState.disclosure.id + '/submit')
    .end((err)=>{
      if (!err) {
        this.resetDisclosure();
        window.location = '#/dashboard';
        this.toggleConfirmationMessage();
      }
    });
  }
}

export let DisclosureStore = alt.createStore(_DisclosureStore, 'DisclosureStore');
