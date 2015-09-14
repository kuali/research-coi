import ConfigActions from '../actions/ConfigActions';
import {AutoBindingStore} from './AutoBindingStore';
import {sortQuestions} from './ConfigUtils';
import alt from '../alt';
import request from 'superagent';
import {COIConstants} from '../../../COIConstants';

class _ConfigStore extends AutoBindingStore {
  constructor() {
    super(ConfigActions);

    this.applicationState = {
      declarationsTypesBeingEdited: {},
      enteringNewType: false,
      newNotification: {},
      newQuestion: {
        screening: undefined,
        entities: undefined
      },
      questionsBeingEdited: {
        screening: {},
        entities: {}
      }
    };

    this.dirty = false;

    this.disclosureTypes = [
      {
        label: 'Annual Disclosure',
        id: 1,
        enabled: true
      },
      {
        label: 'Travel Log',
        id: 2,
        enabled: true
      },
      {
        label: 'Project Disclosure',
        id: 3,
        enabled: false
      },
      {
        label: 'Manual Disclosure',
        id: 4,
        enabled: false
      }
    ];

    this.sponsorLookup = true;

    this.declarationTypes = [
      {
        id: 1,
        text: 'No Conflict',
        showing: true
      },
      {
        id: 2,
        text: 'Potential Relationship',
        showing: true
      },
      {
        id: 3,
        text: 'Relationship Managed',
        showing: false
      }
    ];

    this.dueDate = undefined;
    this.isRollingDueDate = undefined;

    this.notifications = [];

    this.questions = {
      screening: [],
      entities: []
    };

    this.peopleEnabled = true;
    this.people = ['Self', 'Spouse', 'Children', 'Other'];
    this.matrixTypes = [
      {
        name: 'Ownership',
        enabled: true,
        typeEnabled: true,
        typeOptions: [
          'Stock',
          'Stock Options',
          'Other Ownership'
        ],
        amountEnabled: true,
        amountOptions: [
          '$0 - $100',
          '$101 - $1,000',
          '$1,001 - $10,000',
          'Privately held, no valuations',
          'Does not apply'
        ]
      },
      {
        name: 'Offices/Positions',
        enabled: true,
        typeEnabled: true,
        typeOptions: [
          'Board Member',
          'Partner',
          'Other Managerial',
          'Founder'
        ],
        amountEnabled: true,
        amountOptions: [
          '$0 - $100',
          '$101 - $1,000',
          '$1,001 - $10,000',
          'Does not apply'
        ]
      },
      {
        name: 'Paid Activities',
        enabled: true,
        typeEnabled: true,
        typeOptions: [
          'Stock',
          'Stock Options',
          'Other Ownership'
        ],
        amountEnabled: true,
        amountOptions: [
          '$0 - $100',
          '$101 - $1,000',
          '$1,001 - $10,000',
          'Does not apply'
        ]
      },
      {
        name: 'Travel',
        enabled: true,
        typeEnabled: true,
        typeOptions: [
          'Stock',
          'Stock Options',
          'Other Ownership'
        ],
        amountEnabled: true,
        amountOptions: [
          '$0 - $100',
          '$101 - $1,000',
          '$1,001 - $10,000',
          'Does not apply'
        ]
      },
      {
        name: 'Intellectual Property',
        enabled: true,
        typeEnabled: true,
        typeOptions: [
          'Royalty Income',
          'Intellectual Property Rights'
        ],
        amountEnabled: true,
        amountOptions: [
          '$0 - $100',
          '$101 - $1,000',
          '$1,001 - $10,000',
          'Does not apply'
        ]
      },
      {
        name: 'Other',
        enabled: true,
        typeEnabled: true,
        typeOptions: [
          'Contract',
          'Other Transactions'
        ],
        amountEnabled: true,
        amountOptions: [
          '$0 - $100',
          '$101 - $1,000',
          '$1,001 - $10,000',
          'Does not apply'
        ]
      }
    ];

    this.certificationOptions = {
      text: '',
      required: true
    };

    this.instructions = {
    };
  }

  insertOrders(questions) {
    let order = 1;
    questions.filter(question => {
      return !question.parent;
    }).forEach(question => {
      question.order = order++;
      let subOrder = 1;
      questions.filter(toFilter => {
        return toFilter.parent === question.id;
      }).forEach(sub => {
        sub.order = subOrder;
      });
    });
  }

  convertQuestionFormat(questions) {
    let formattedQuestions = [];
    this.insertOrders(questions);
    questions.forEach((question) => {
      question.text = question.question.text;
      question.type = question.question.type;
      question.validations = question.question.validations;
      question.displayCriteria = question.question.displayCriteria;
      question.multiSelectOptions = question.question.multiSelectOptions;
      question.requiredNumSelections = question.question.requiredNumSelections;

      formattedQuestions.push(question);
      delete question.question;
    });

    return formattedQuestions;
  }

  refreshQuestionnaire() {
    request.get('/api/coi/questionnaires/screening/latest')
           .end((err, questionnaire) => {
             if (!err) {
               this.questions.screening = sortQuestions(this.convertQuestionFormat(questionnaire.body.questions));
               this.emitChange();
             }
           });
    request.get('/api/coi/questionnaires/entities/latest')
           .end((err, questionnaire) => {
             if (!err) {
               this.questions.entities = sortQuestions(this.convertQuestionFormat(questionnaire.body.questions));
               this.emitChange();
             }
           });
  }

  loadLatestQuestionnaire() {
    this.refreshQuestionnaire();
  }

  startEditingDeclarationType(id) {
    this.applicationState.declarationsTypesBeingEdited[id] = {
      newValue: this.declarationTypes.find(type => { return id === type.id; }).text
    };
    this.dirty = true;
  }

  updateDeclarationType(params) {
    this.applicationState.declarationsTypesBeingEdited[params.id].newValue = params.newValue;
    this.dirty = true;
  }

  stopEditingDeclarationType(id) {
    let newValue = this.applicationState.declarationsTypesBeingEdited[id].newValue;
    this.declarationTypes.find(type => { return id === type.id; }).text = newValue;
    delete this.applicationState.declarationsTypesBeingEdited[id];
    this.dirty = true;
  }

  toggleDeclarationType(id) {
    let typeObject = this.declarationTypes.find(type => { return id === type.id; });
    typeObject.showing = !typeObject.showing;
    this.dirty = true;
  }

  startEnteringNewDeclarationType() {
    this.applicationState.enteringNewType = true;
    this.dirty = true;
  }

  deleteInProgressCustomDeclarationType() {
    this.applicationState.enteringNewType = false;
    this.dirty = true;
  }

  saveNewDeclarationType() {
    // Eventually get id from server
    this.declarationTypes.push({
      id: new Date().getTime(),
      showing: true,
      text: this.applicationState.newTypeText,
      custom: true
    });
    this.applicationState.enteringNewType = false;
    this.applicationState.newTypeText = '';
    this.dirty = true;
  }

  setNewDeclarationTypeText(newValue) {
    this.applicationState.newTypeText = newValue;
    this.dirty = true;
  }

  deleteDeclarationType(id) {
    this.declarationTypes = this.declarationTypes.filter(type => {
      return type.id !== id;
    });
    this.dirty = true;
  }

  enableDisclosureType(id) {
    this.disclosureTypes.find(type => { return id === type.id; }).enabled = true;
    this.dirty = true;
  }

  disableDisclosureType(id) {
    this.disclosureTypes.find(type => { return id === type.id; }).enabled = false;
    this.dirty = true;
  }

  updateDisclosureType(params) {
    this.disclosureTypes.find(type => { return params.id === type.id; }).label = params.newValue;
    this.dirty = true;
  }

  enableSponsorLookup() {
    this.sponsorLookup = true;
    this.dirty = true;
  }

  disableSponsorLookup() {
    this.sponsorLookup = false;
    this.dirty = true;
  }

  setDueDate(newDate) {
    this.dueDate = newDate;
    this.dirty = true;
  }

  setIsRollingDueDate(value) {
    this.isRollingDueDate = value;
    this.dirty = true;
  }

  setWarningValueOnNotification(params) {
    let targetNote;
    if (params.id) {
      targetNote = this.notifications.find(notification => { return notification.id === params.id; });
    }
    else {
      targetNote = this.applicationState.newNotification;
    }

    if (targetNote) {
      targetNote.warningValue = params.newValue;
    }
    this.dirty = true;
  }

  setWarningPeriodOnNotification(params) {
    let targetNote;
    if (params.id) {
      targetNote = this.notifications.find(notification => { return notification.id === params.id; });
    }
    else {
      targetNote = this.applicationState.newNotification;
    }

    if (targetNote) {
      targetNote.warningPeriod = params.newValue;
    }
    this.dirty = true;
  }

  setReminderTextOnNotification(params) {
    let targetNote;
    if (params.id) {
      targetNote = this.notifications.find(notification => { return notification.id === params.id; });
    }
    else {
      targetNote = this.applicationState.newNotification;
    }

    if (targetNote) {
      targetNote.reminderText = params.newValue;
    }
    this.dirty = true;
  }

  saveNewNotification() {
    this.applicationState.newNotification.id = new Date().getTime(); // Fix when using db
    this.notifications.push(this.applicationState.newNotification);
    this.applicationState.newNotification = {
      reminderText: '',
      warningPeriod: 'Days',
      warningValue: 1
    };
    this.dirty = true;
  }

  deleteNotification(id) {
    this.notifications = this.notifications.filter(notification => {
      return notification.id !== id;
    });
    this.dirty = true;
  }

  findQuestion(category, id) {
    if (id) {
      return this.questions[category].find(question => {
        return question.id === id;
      });
    }
    else {
      return this.applicationState.newQuestion[category];
    }
  }

  hasSubQuestions(category, parentId) {
    return this.questions[category].some(question => {
      return question.parent === parentId;
    });
  }

  questionTypeChosen(params) {
    let targetQuestion;
    if (params.questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[params.category][params.questionId];

      targetQuestion.showWarning = this.hasSubQuestions(params.category, targetQuestion.id) && params.type !== COIConstants.QUESTION_TYPE.YESNO;
    }
    else {
      targetQuestion = this.applicationState.newQuestion[params.category];
    }

    targetQuestion.type = params.type;
    this.dirty = true;
  }

  questionTextChanged(params) {
    let targetQuestion;
    if (params.questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[params.category][params.questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[params.category];
    }

    targetQuestion.text = params.text;
    this.dirty = true;
  }

  updateQuestions(params) {
    this.questions[params.category] = params.questions;
    this.dirty = true;
  }

  cancelNewQuestion(params) {
    this.applicationState.newQuestion[params.category] = undefined;
    this.dirty = true;
  }

  saveNewQuestion(params) {
    if (!this.applicationState.newQuestion[params.category].type) {
      return;
    }

    this.applicationState.newQuestion[params.category].id = new Date().getTime();

    this.questions[params.category].filter(question => {
      return !question.parent;
    }).forEach(question => {
      question.order += 1;
    });

    this.applicationState.newQuestion[params.category].order = 1;
    this.questions[params.category].push(this.applicationState.newQuestion[params.category]);
    this.applicationState.newQuestion[params.category] = undefined;
    this.dirty = true;
  }

  startNewQuestion(params) {
    this.applicationState.newQuestion[params.category] = {};
    this.dirty = true;
  }

  deleteQuestion(params) {
    this.questions[params.category] = this.questions[params.category].filter(question => {
      return question.id !== params.questionId && question.parent !== params.questionId;
    });

    this.dirty = true;
  }

  removeSubQuestions(category, parentId) {
    this.questions[category] = this.questions[category].filter(question => {
      return question.parent !== parentId;
    });
  }

  saveQuestionEdit(params) {
    let index = this.questions[params.category].findIndex(question => {
      return question.id === params.questionId;
    });

    let editedQuestion = this.applicationState.questionsBeingEdited[params.category][params.questionId];
    delete editedQuestion.showWarning;
    if (index !== -1) {
      this.questions[params.category][index] = editedQuestion;
    }

    if (editedQuestion.type !== COIConstants.QUESTION_TYPE.YESNO) {
      this.removeSubQuestions(params.category, editedQuestion.id);
    }

    delete this.applicationState.questionsBeingEdited[params.category][params.questionId];

    this.dirty = true;
  }

  startEditingQuestion(params) {
    let clone = JSON.parse(JSON.stringify(this.findQuestion(params.category, params.questionId)));
    this.applicationState.questionsBeingEdited[params.category][params.questionId] = clone;

    this.dirty = true;
  }

  cancelQuestionEdit(params) {
    delete this.applicationState.questionsBeingEdited[params.category][params.questionId];

    this.dirty = true;
  }

  criteriaChanged(params) {
    let question = this.findQuestion(params.category, params.questionId);
    if (question) {
      question.displayCriteria = params.newValue;
    }

    this.dirty = true;
  }

  multiSelectOptionAdded(params) {
    let targetQuestion;
    if (params.questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[params.category][params.questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[params.category];
    }

    if (!targetQuestion.options) {
      targetQuestion.options = [];
    }
    targetQuestion.options.push(params.newValue);

    this.dirty = true;
  }

  multiSelectOptionDeleted(params) {
    let targetQuestion;
    if (params.questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[params.category][params.questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[params.category];
    }

    if (targetQuestion.options) {
      targetQuestion.options = targetQuestion.options.filter(option => {
        return option !== params.optionId;
      });
    }

    this.dirty = true;
  }

  requiredNumSelectionsChanged(params) {
    let targetQuestion;
    if (params.questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[params.category][params.questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[params.category];
    }

    targetQuestion.requiredNumSelections = params.newValue;

    this.dirty = true;
  }

  relationshipPeopleChanged(newPeople) {
    this.people = newPeople;
    this.dirty = true;
  }

  relationshipPeopleEnabled(newValue) {
    this.peopleEnabled = newValue;
    this.dirty = true;
  }

  enabledChanged(params) {
    let target = this.matrixTypes.find(matrixType => {
      return matrixType.name === params.relationshipType;
    });

    if (target) {
      target.enabled = params.newValue;
    }
    this.dirty = true;
  }

  typeEnabledChanged(params) {
    let target = this.matrixTypes.find(matrixType => {
      return matrixType.name === params.relationshipType;
    });

    if (target) {
      target.typeEnabled = params.newValue;
    }
    this.dirty = true;
  }

  amountEnabledChanged(params) {
    let target = this.matrixTypes.find(matrixType => {
      return matrixType.name === params.relationshipType;
    });

    if (target) {
      target.amountEnabled = params.newValue;
    }
    this.dirty = true;
  }

  typeOptionsChanged(params) {
    let target = this.matrixTypes.find(matrixType => {
      return matrixType.name === params.relationshipType;
    });

    if (target) {
      target.typeOptions = params.newList;
    }
    this.dirty = true;
  }

  amountOptionsChanged(params) {
    let target = this.matrixTypes.find(matrixType => {
      return matrixType.name === params.relationshipType;
    });

    if (target) {
      target.amountOptions = params.newList;
    }
    this.dirty = true;
  }

  setCertificationText(newText) {
    this.certificationOptions.text = newText;
    this.dirty = true;
  }

  setCertificationRequired(newValue) {
    this.certificationOptions.required = newValue;
    this.dirty = true;
  }

  setInstructions(params) {
    this.instructions[params.step] = params.newValue;
    this.dirty = true;
  }

  loadAllConfigData() {
    // reload all data from the backend
    this.dirty = false;
  }

  saveAll() {
    // persist all data to the backend
    this.dirty = false;
  }

  undoAll() {
    this.loadAllConfigData();
  }
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
