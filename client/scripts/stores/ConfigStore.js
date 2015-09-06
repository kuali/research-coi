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
      disclosureTypesBeingEdited: {},
      newNotification: {},
      newQuestion: undefined,
      questionsBeingEdited: {}
    };

    this.disclosureTypes = [
      {
        label: 'Annual Disclosure',
        id: 1
      },
      {
        label: 'Travel Log',
        id: 2
      },
      {
        label: 'Project Disclosure',
        id: 3
      },
      {
        label: 'Manual Disclosure',
        id: 4
      }
    ];

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

    this.questions = [];
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

      formattedQuestions.push(question);
      delete question.question;
    });

    return formattedQuestions;
  }

  refreshQuestionnaire() {
    request.get('/api/coi/questionnaires/latest')
           .end((err, questionnaire) => {
             if (!err) {
               this.questions = sortQuestions(this.convertQuestionFormat(questionnaire.body.questions));
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
  }

  updateDeclarationType(params) {
    this.applicationState.declarationsTypesBeingEdited[params.id].newValue = params.newValue;
  }

  stopEditingDeclarationType(id) {
    let newValue = this.applicationState.declarationsTypesBeingEdited[id].newValue;
    this.declarationTypes.find(type => { return id === type.id; }).text = newValue;
    delete this.applicationState.declarationsTypesBeingEdited[id];
  }

  toggleDeclarationType(id) {
    let typeObject = this.declarationTypes.find(type => { return id === type.id; });
    typeObject.showing = !typeObject.showing;
  }

  startEnteringNewDeclarationType() {
    this.applicationState.enteringNewType = true;
  }

  deleteInProgressCustomDeclarationType() {
    this.applicationState.enteringNewType = false;
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
  }

  setNewDeclarationTypeText(newValue) {
    this.applicationState.newTypeText = newValue;
  }

  deleteDeclarationType(id) {
    this.declarationTypes = this.declarationTypes.filter(type => {
      return type.id !== id;
    });
  }

  startEditingDisclosureType(id) {
    this.applicationState.disclosureTypesBeingEdited[id] = {
      newValue: this.disclosureTypes.find(type => { return id === type.id; }).text
    };
  }

  updateDisclosureType(params) {
    delete this.applicationState.disclosureTypesBeingEdited[params.id];
    this.disclosureTypes.find(type => { return params.id === type.id; }).label = params.newValue;
  }

  setDueDate(newDate) {
    this.dueDate = newDate;
  }

  setIsRollingDueDate(value) {
    this.isRollingDueDate = value;
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
  }

  saveNewNotification() {
    this.applicationState.newNotification.id = new Date().getTime(); // Fix when using db
    this.notifications.push(this.applicationState.newNotification);
    this.applicationState.newNotification = {
      reminderText: '',
      warningPeriod: 'Days',
      warningValue: 1
    };
  }

  findQuestion(id) {
    if (id) {
      return this.questions.find(question => {
        return question.id === id;
      });
    }
    else {
      return this.applicationState.newQuestion;
    }
  }

  validationAddedToQuestion(params) {
    let targetQuestion = this.findQuestion(params.questionId);

    if (!targetQuestion.validations) {
      targetQuestion.validations = [];
    }

    targetQuestion.validations.push({
      id: new Date().getTime(),
      text: params.validation
    });
  }

  validationRemovedFromQuestion(params) {
    let targetQuestion = this.findQuestion(params.questionId);

    if (targetQuestion.validations) {
      targetQuestion.validations = targetQuestion.validations.filter(validation => {
        return validation.id !== params.validationId;
      });
    }
  }

  hasSubQuestions(parentId) {
    return this.questions.some(question => {
      return question.parent === parentId;
    });
  }

  questionTypeChosen(params) {
    let targetQuestion;
    if (params.questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[params.questionId];

      targetQuestion.showWarning = this.hasSubQuestions(targetQuestion.id) && params.type !== COIConstants.QUESTION_TYPE.YESNO;
    }
    else {
      targetQuestion = this.applicationState.newQuestion;
    }

    targetQuestion.type = params.type;
  }

  questionTextChanged(params) {
    let targetQuestion;
    if (params.questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[params.questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion;
    }

    targetQuestion.text = params.text;
  }

  updateQuestions(questions) {
    this.questions = questions;
  }

  cancelNewQuestion() {
    this.applicationState.newQuestion = undefined;
  }

  saveNewQuestion() {
    this.applicationState.newQuestion.id = new Date().getTime();

    this.questions.filter(question => {
      return !question.parent;
    }).forEach(question => {
      question.order += 1;
    });

    this.applicationState.newQuestion.order = 1;
    this.questions.push(this.applicationState.newQuestion);
    this.applicationState.newQuestion = undefined;
  }

  startNewQuestion() {
    this.applicationState.newQuestion = {};
  }

  deleteQuestion(questionId) {
    this.questions = this.questions.filter(question => {
      return question.id !== questionId && question.parent !== questionId;
    });
  }

  removeSubQuestions(parentId) {
    this.questions = this.questions.filter(question => {
      return question.parent !== parentId;
    });
  }

  saveQuestionEdit(questionId) {
    let index = this.questions.findIndex(question => {
      return question.id === questionId;
    });

    let newQuestion = this.applicationState.questionsBeingEdited[questionId];
    delete newQuestion.showWarning;
    if (index !== -1) {
      this.questions[index] = newQuestion;
    }

    if (newQuestion.type !== COIConstants.QUESTION_TYPE.YESNO) {
      this.removeSubQuestions(newQuestion.id);
    }

    delete this.applicationState.questionsBeingEdited[questionId];
  }

  startEditingQuestion(questionId) {
    let clone = JSON.parse(JSON.stringify(this.findQuestion(questionId)));
    this.applicationState.questionsBeingEdited[questionId] = clone;
  }

  cancelQuestionEdit(questionId) {
    delete this.applicationState.questionsBeingEdited[questionId];
  }

  findPrecedingQuestion(questionId) {
    let currentIndex = this.questions.findIndex(question => { return question.id === questionId; });

    if (currentIndex > 0) {
      return currentIndex - 1;
    }
    else {
      return -1;
    }
  }
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
