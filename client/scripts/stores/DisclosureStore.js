import {DisclosureActions} from '../actions/DisclosureActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import {COIConstants} from '../../../COIConstants';
import {processResponse, createRequest} from '../HttpUtils';
import ConfigActions from '../actions/ConfigActions';

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
      entityRelationshipsAreSubmittable: this.entityRelationshipsAreSubmittable
    });

    // initialize state here
    this.disclosures = [];

    this.applicationState = {
      archiveFilter: '2',
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
      potentialRelationship: {
        personCd: '',
        relationshipCd: '',
        typeCd: '',
        amountCd: '',
        comments: '',
        travel: {}
      },
      validatingEntityNameStep: false,
      validatingEntityInformationStep: false,
      validatingEntityRelationshipStep: false
    };

    this.loadProjects();

    this.entities = [];
    this.declarations = [];
    this.archivedDisclosures = [];
    this.archivedDisclosureDetail = undefined;
    this.disclosureSummariesForUser = [];
  }

  loadProjects() {
    createRequest().get('/api/coi/projects')
           .end(processResponse((err, projects) => {
             if (!err) {
               this.projects = projects.body;
               this.emitChange();
             }
           }));
  }

  refreshArchivedDisclosures() {
    createRequest().get('/api/coi/archived-disclosures')
           .end(processResponse((err, disclosures) => {
             if (!err) {
               this.archivedDisclosures = disclosures.body;
               this.emitChange();
             }
           }));
  }

  loadArchivedDisclosures() {
    this.refreshArchivedDisclosures();
  }

  loadArchivedDisclosureDetail(id) {
    createRequest().get('/api/coi/disclosures/' + id)
           .end(processResponse((err, disclosure) => {
             if (!err) {
               this.archivedDisclosureDetail = disclosure.body;
               this.emitChange();
             }
           }));
  }

  refreshDisclosureSummaries() {
    createRequest().get('/api/coi/disclosure-user-summaries')
      .end(processResponse((err, disclosures) => {
        if (!err) {
          this.disclosureSummariesForUser = disclosures.body;
          createRequest().get('/api/coi/config')
          .end(processResponse((error, config) => {
            if (!error) {
              window.config = config.body;
              this.emitChange();
            }
          }));
        }
      }));
  }

  loadDisclosureSummaries() {
    this.refreshDisclosureSummaries();
  }

  loadDisclosureData(disclosureType) {
    if (disclosureType === COIConstants.DISCLOSURE_TYPE.ANNUAL) {
      createRequest().get('/api/coi/disclosures/annual')
      .end(processResponse((err, disclosure) => {
        if (!err) {
          this.applicationState.currentDisclosureState.disclosure = disclosure.body;
          this.entities = disclosure.body.entities;
          this.declarations = disclosure.body.declarations;
          this.files = disclosure.body.files;
          createRequest().get('/api/coi/archived-config/' + disclosure.body.configId)
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
      this.applicationState.currentDisclosureState.disclosure.answers.push(answer);
    }

    if (answer.id) {
      createRequest().put('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/question-answers/' + answer.questionId)
        .send(answer)
        .type('application/json')
        .end(processResponse((err, res) => {
          if (!err) {
            answer.id = res.body.id;
            if (question.advance) {
              this.advanceQuestion();
            }
            this.emitChange();
          }
        }));
    } else {
      createRequest().post('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/question-answers')
        .send(answer)
        .type('application/json')
        .end(processResponse((err, res) => {
          if(!err) {answer.id = res.body.id;
            if (question.advance) {
              this.advanceQuestion();
            }
            this.emitChange();
          }
        }));
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

  answerEntityQuestion(question) {
    let entity = question.entityId ? this.getEntity(question.entityId) : this.applicationState.entityInProgress;

    if (!entity.answers) {
      entity.answers = [];
    }

    let existingAnswer = entity.answers.find(answer => {
      return answer.questionId === question.id;
    });

    if (existingAnswer) {
      existingAnswer.answer.value = question.answer.value;
    }
    else {
      let newAnswer = {questionId: question.id, answer: question.answer};
      entity.answers.push(newAnswer);
    }
  }

  answerEntityMultiple(question) {
    let entity = question.entityId ? this.getEntity(question.entityId) : this.applicationState.entityInProgress;
    if (!entity.answers) {
      entity.answers = [];
    }
    let existingAnswer = entity.answers.find(answer => {
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
      entity.answers.push(newAnswer);
    }
  }

  addEntityAttachments(data) {
    let entity = data.entityId ? this.getEntity(data.entityId) : this.applicationState.entityInProgress;
    if(!entity.files) {
      entity.files = [];
    }

    data.files.forEach(file=>{
      entity.files.push(file);
    });
  }

  deleteEntityAttachment(data) {
    let entity = data.entityId ? this.getEntity(data.entityId) : this.applicationState.entityInProgress;
    entity.files.splice(data.index, 1);
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

    let formData = new FormData();
    formData.append('entity', JSON.stringify(entity));
    createRequest().put('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/financial-entities/' + entity.id)
    .send(formData)
    .end(processResponse(() => {}));
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

  setEntityRelationshipTravelAmount(amount) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    if (!this.applicationState.potentialRelationship.travel) {
      this.applicationState.potentialRelationship.travel = {};
    }

    this.applicationState.potentialRelationship.travel.amount = amount;
  }

  setEntityRelationshipTravelDestination(destination) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    if (!this.applicationState.potentialRelationship.travel) {
      this.applicationState.potentialRelationship.travel = {};
    }

    this.applicationState.potentialRelationship.travel.destination = destination;
  }

  setEntityRelationshipTravelStartDate(date) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    if (!this.applicationState.potentialRelationship.travel) {
      this.applicationState.potentialRelationship.travel = {};
    }

    this.applicationState.potentialRelationship.travel.startDate = date;
  }

  setEntityRelationshipTravelEndDate(date) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    if (!this.applicationState.potentialRelationship.travel) {
      this.applicationState.potentialRelationship.travel = {};
    }

    this.applicationState.potentialRelationship.travel.endDate = date;
  }

  setEntityRelationshipTravelReason(reason) {
    if (!this.applicationState.potentialRelationship) {
      this.applicationState.potentialRelationship = {};
    }

    if (!this.applicationState.potentialRelationship.travel) {
      this.applicationState.potentialRelationship.travel = {};
    }

    this.applicationState.potentialRelationship.travel.reason = reason;
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

    relation.id = COIConstants.TMP_PLACEHOLDER + new Date().getTime();
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
      comments: '',
      travel: {}
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

      let formData = new FormData();
      let existingFiles = [];
      if (entity.files && entity.files.length > 0) {
        entity.files.forEach(file=> {
          if (file.preview) {
            formData.append('attachments', file);
          } else {
            existingFiles.push(file);
          }
        });
      }

      entity.files = existingFiles;

      formData.append('entity', JSON.stringify(entity));

      if (this.applicationState.entityStates[entity.id].editing === true) {
        createRequest().put('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/financial-entities/' + entity.id )
        .send(formData)
        .end(processResponse((err, res) => {
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
        }));
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
        active: 1,
        answers: []
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

    let formData = new FormData();
    if (entity.files && entity.files.length > 0) {
      entity.files.forEach(file=> {
        formData.append('attachments', file);
      });
    }

    formData.append('entity', JSON.stringify(entity));

    createRequest().post('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/financial-entities')
    .send(formData)
    .end(processResponse((err, res) => {
      if (!err) {
        this.entities.push(res.body);

        this.applicationState.entityInProgress = {
          active: 1,
          answers: []
        };

        this.applicationState.newEntityFormStep = -1;

        this.emitChange();
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
      createRequest().put('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/declarations/' + existing.id)
      .send(existing)
      .type('application/json')
      .end(processResponse(() => {}));
    }
    else {
      let newRelation = {
        finEntityId: params.finEntityId,
        typeCd: params.typeCd
      };
      newRelation[field] = params.projectId;
      createRequest().post('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/declarations')
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
      createRequest().put('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/declarations/' + existing.id)
      .send(existing)
      .type('application/json')
      .end(processResponse(() => {}));
    }
    else {
      let newRelation = {
        finEntityId: params.finEntityId,
        comments: params.comments
      };
      newRelation[field] = params.projectId;
      createRequest().post('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/declarations')
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

  setAllForEntity(params) {
    this.projects.forEach(project => {
      this.entityRelationChosen({
        relationType: 'PROJECT',
        finEntityId: params.finEntityId,
        projectId: project.id,
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
      active: 1,
      answers: []
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

  entityInformationStepErrors(entityId) {
    let errors = [];

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


    window.config.questions.entities.forEach(question=>{

      let answer = entity.answers.find(a => {
        return a.questionId === question.id;
      });

      let value;
      if (answer) {
        value = answer.answer.value;
      }

      if (question.question.type === COIConstants.QUESTION_TYPE.MULTISELECT && question.question.requiredNumSelections > 1) {
        if(value instanceof Array) {
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
    let errors = this.entityInformationStepErrors(entityId);

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
        if (matrixType.description === 'Travel') {
          if (potentialRelationship.travel.amount === undefined || potentialRelationship.travel.amount.length === 0) {
            errors.travelAmount = 'Required Field';
          } else if (isNaN(potentialRelationship.travel.amount)) {
            errors.travelAmount = 'Numeric Value Only';
          }
        } else {
          if (potentialRelationship.amountCd === undefined || potentialRelationship.amountCd.length === 0) {
            errors.amount = 'Required Field';
          }
        }
      }

      if (matrixType.destinationEnabled === 1) {
        if (potentialRelationship.travel.destination === undefined || potentialRelationship.travel.destination.length === 0) {
          errors.travelDestination = 'Required Field';
        }
      }

      if (matrixType.dateEnabled === 1) {
        if (potentialRelationship.travel.startDate === undefined || potentialRelationship.travel.startDate.length === 0) {
          errors.travelStartDate = 'Required Field';
        }
        if (potentialRelationship.travel.endDate === undefined || potentialRelationship.travel.endDate.length === 0) {
          errors.travelEndDate = 'Required Field';
        }
        if (potentialRelationship.travel.startDate && potentialRelationship.travel.endDate &&
          potentialRelationship.travel.startDate > potentialRelationship.travel.endDate) {
          errors.travelEndDate = 'Return date must be after departure date';
        }
      }

      if (matrixType.reasonEnabled === 1) {
        if (potentialRelationship.travel.reason === undefined || potentialRelationship.travel.reason.length === 0) {
          errors.travelReason = 'Required Field';
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

  entityRelationshipsAreSubmittable(id) {
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

  addDisclosureAttachment(files) {
    if (!this.files) {
      this.files = [];
    }

    let formData = new FormData();
    files.forEach(file => {
      formData.append('attachments', file);
    });

    formData.append('data', JSON.stringify({
      refId: this.applicationState.currentDisclosureState.disclosure.id,
      type: COIConstants.FILE_TYPE.DISCLOSURE,
      disclosureId: this.applicationState.currentDisclosureState.disclosure.id
    }));

    createRequest().post('/api/coi/files')
    .send(formData)
    .end(processResponse((err, res) => {
      if (!err) {
        res.body.forEach(file => {
          this.files.push(file);
          this.emitChange();
        });
      }
    }));
  }

  deleteDisclosureAttachment(index) {
    let file = this.files[index];

    createRequest().del('/api/coi/files/' + file.id)
    .send(file)
    .type('application/json')
    .end(processResponse((err) => {
      if (!err) {
        this.files.splice(index, 1);
        this.emitChange();
      }
    }));
  }


  certify(value) {
    this.applicationState.currentDisclosureState.isCertified = value;
  }

  submitDisclosure() {
    createRequest().put('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/submit')
    .end(processResponse(err => {
      if (!err) {
        this.resetDisclosure();
        window.location = '#/dashboard';
        this.toggleConfirmationMessage();
      }
    }));
  }

  deleteAnswersTo(toDelete) {
    let answerObject = this.applicationState.currentDisclosureState.disclosure.answers;
    if (answerObject) {
      this.applicationState.currentDisclosureState.disclosure.answers = answerObject.filter(answer => {
        return !toDelete.includes(answer.questionId);
      });
    }

    if (toDelete.length > 0) {
      createRequest().del('/api/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id + '/question-answers')
        .send({
          toDelete: toDelete
        })
        .type('application/json')
        .end(processResponse(() => {}));
    }
  }
}

export let DisclosureStore = alt.createStore(_DisclosureStore, 'DisclosureStore');
