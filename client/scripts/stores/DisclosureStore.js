import {DisclosureActions} from '../actions/DisclosureActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import request from 'superagent';
import {COIConstants} from '../../../COIConstants';

class _DisclosureStore extends AutoBindingStore {
  constructor() {
    super (DisclosureActions);

    this.exportPublicMethods({
      getDisclosure: this.getDisclosure
    });

    // initialize state here
    this.disclosures = [];

    this.applicationState = {
      archiveFilter: 'ALL',
      instructionsShowing: false,
      currentDisclosureState: {
        step: COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE,
        question: 1,
        disclosure: {
          id: 222
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
      declarationView: 'Project View',
      entityStates: {},
      entityInProgress: {}
    };

    this.projects = [
      {
        title: "Molecular Disentropization",
        type: "Research",
        role: "PI",
        sponsor: "NIH",
        cosponsor: "Quest Diagnostics Inc.",
        projectid: "250240"
      },
      {
        title: "Adolescent Diabetes Recurrence",
        type: "Research",
        role: "PI",
        sponsor: "NIH",
        cosponsor: "W.W. Grainger Inc",
        projectid: "250499"
      },
      {
        title: "Photosynthesis and Salinity",
        type: "Research",
        role: "PI",
        sponsor: "NSA",
        cosponsor: "Sempra Energy",
        projectid: "287110"
      }
    ];

    this.entities = [];
    this.archivedDisclosures = [];
    this.disclosureSummariesForUser = [];
  }

  refreshArchivedDisclosures() {
    request.get('/api/research/coi/disclosures/archived')
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

  refreshDisclosureSummaries() {
    request.get('/api/research/coi/disclosure-user-summaries')
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

  changeArchiveFilter(newValue) {
    this.applicationState.archiveFilter = newValue;
    this.refreshArchivedDisclosures();
  }

  toggleInstructions() {
    this.applicationState.instructionsShowing = !this.applicationState.instructionsShowing;
  }

  answerQuestion(question) {
    let questionId = question.id;
    let answer = question.answer;
    if (!this.applicationState.currentDisclosureState.disclosure.answers) {
      this.applicationState.currentDisclosureState.disclosure.answers = [];
    }
    let existingAnswer = this.applicationState.currentDisclosureState.disclosure.answers.find((answer) => {
      return answer.id === question.id;
    });
    if (existingAnswer) {
      existingAnswer.value = question.answer;
    }
    else {
      this.applicationState.currentDisclosureState.disclosure.answers.push({id: questionId, value: answer});
    }

    request.put('/api/research/coi/disclosures/' + this.applicationState.currentDisclosureState.disclosure.id)
           .send(this.applicationState.currentDisclosureState.disclosure);
  }

  advanceQuestion() {
    if (this.applicationState.currentDisclosureState.question >= window.config.questions.length) {
      this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY;
    }
    else {
      this.applicationState.currentDisclosureState.question++;
    }
  }

  previousQuestion() {
    switch (this.applicationState.currentDisclosureState.step) {
      case COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE:
        if (this.applicationState.currentDisclosureState.question > 1) {
          this.applicationState.currentDisclosureState.question--;
        }
        break;
      case COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
        this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
        this.applicationState.currentDisclosureState.question = window.config.questions.length;
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

  getEntity(id) {
    return this.entities.find(entity => {
      return entity.id === id;
    });
  }

  setEntityStatus(params) {
    let entity = params.id ? this.getEntity(params.id) : this.applicationState.entityInProgress;
    entity.status = params.status;
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

  addEntityRelationship(params) {
    let person = params.person;
    let relation = params.relation;
    let type = params.type;
    let amount = params.amount;
    let comment = params.comment;

    let entity = params.id ? this.getEntity(params.id) : this.applicationState.entityInProgress;

    if (!entity.relationships) {
      entity.relationships = [];
    }

    entity.relationships.push({
      id: new Date().getTime() + 'FAKE', // relationship id
      person: person,
      relationship: relation,
      type: type,
      amount: amount,
      comments: comment
    });
  }

  removeEntityRelationship(params) {
    let relationId = params.relationId;
    let entityId = params.entityId;

    let entity = this.applicationState.entityInProgress;

    entity.relationships = entity.relationships.filter((relationship) => {
      return relationship.id !== relationId;
    });
  }

  entityFormClosed(entityId) {
    if (entityId) {
      if (!this.applicationState.entityStates[entityId]) {
        this.applicationState.entityStates[entityId] = {};
      }
      this.applicationState.entityStates[entityId].formStep = -1;
      this.applicationState.entityStates[entityId].editing = false;
    }
    else {
      this.applicationState.newEntityFormStep = -1;
    }
  }

  saveInProgressEntity(entity) {
    entity.id = new Date().getTime(); // For mocking backend

    if (!this.entities) {
      this.entities = [];
    }
    this.entities.push(entity);

    this.applicationState.entityInProgress = {};
    this.applicationState.newEntityFormStep = -1;
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
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].id === snapshot.id) {
        this.entities[i] = snapshot;
        break;
      }
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
      }
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
      return declaration.entityId === params.entityId && declaration[field] === params.projectId;
    });

    if (existing) {
      existing.relation = params.relation;
    }
    else {
      let newRelation = {
        entityId: params.entityId,
        relation: params.relation
      };
      newRelation[field] = params.projectId;
      this.declarations.push(newRelation);
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
      return declaration.entityId === params.entityId && declaration[field] === params.projectId;
    });

    if (existing) {
      existing.comment = params.comment;
    }
    else {
      let newRelation = {
        entityId: params.entityId,
        comment: params.comment
      };
      newRelation[field] = params.projectId;
      this.declarations.push(newRelation);
    }    
  }

  setAllForEntity(params) {
    this.projects.forEach(project => {
      this.entityRelationChosen({
        relationType: 'PROJECT',
        entityId: params.entityId,
        projectId: project.projectid,
        relation: params.newValue
      });
    });
  }

  setAllForProject(params) {
    this.entities.forEach(entity => {
      this.entityRelationChosen({
        relationType: params.type,
        entityId: entity.id,
        projectId: params.projectId,
        relation: params.newValue
      });
    });
  }

  resetDisclosure() { 
    let id = this.applicationState.currentDisclosureState.disclosure.id;
    this.applicationState.currentDisclosureState.step = COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
    this.applicationState.currentDisclosureState.question = 1;
    this.applicationState.entityInProgress = {};
    this.applicationState.entityStates = {};
  }

  toggleConfirmationMessage() {
    this.applicationState.confirmationShowing = !this.applicationState.confirmationShowing;
  }

  manualTypeSelected(params) {
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

  doneEditingManualEvent(disclosureId) {
    this.applicationState.manualStep = 3;
  }

  jumpToStep(step) {
    this.applicationState.currentDisclosureState.step = step;
  }
}

let cloneObject = original => {
  return JSON.parse(JSON.stringify(original));
}

export let DisclosureStore = alt.createStore(_DisclosureStore, 'DisclosureStore');