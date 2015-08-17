import ConfigActions from '../actions/ConfigActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';

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

    this.questions = [
      {
        id: 1,
        type: '',
        validations: [
        ],
        text: 'Denver Broncos or Colorado Rockies.  Doesn\'t really matter.  Neither one works well when what you need is a hammer drill.  Right?',
        subQuestions: [
        ]
      }
    ];
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
      if (this.applicationState.questionsBeingEdited[id] !== undefined) {
        return this.applicationState.questionsBeingEdited[id];
      }

      return this.questions.find(question => { return question.id === id; });
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

  questionTypeChosen(params) {
    debugger;
    let targetQuestion = this.findQuestion(params.questionId);
    targetQuestion.type = params.type;
  }

  questionTextChanged(params) {
    let targetQuestion = this.findQuestion(params.questionId);
    targetQuestion.text = params.text;
  }


  cancelNewQuestion() {
    this.applicationState.newQuestion = undefined;
  }

  saveNewQuestion() {
    this.applicationState.newQuestion.id = new Date().getTime();
    this.questions.push(this.applicationState.newQuestion);
    this.applicationState.newQuestion = undefined;
  }

  startNewQuestion() {
    this.applicationState.newQuestion = {};
  }

  questionMovedTo(params) {
    let currentIndex = this.questions.findIndex(question => {
      return question.id === params.questionId;
    });
    if (
        currentIndex === -1 ||
        params.position > this.questions.length ||
        currentIndex === params.position ||
        (currentIndex + 1) === params.position
       )
    {
      return;
    }

    if (currentIndex < params.position) {
      params.position -= 1;
    }

    let questionRef = this.questions.splice(currentIndex, 1)[0];
    this.questions.splice(params.position, 0, questionRef);
  }

  deleteQuestion(questionId) {
    let index = this.questions.findIndex(question => {
      return question.id === questionId;
    });

    if (index !== -1) {
      this.questions.splice(index, 1);
    }
  }

  saveQuestionEdit(questionId) {
    let index = this.questions.findIndex(question => {
      return question.id === questionId;
    });

    if (index !== -1) {
      this.questions[index] = this.applicationState.questionsBeingEdited[questionId];
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

  makeSubQuestion(questionId) {
    let previousIndex = this.findPrecedingQuestion(questionId);

    if (previousIndex >= 0) {
      if (!this.questions[previousIndex].subQuestions) {
        this.questions[previousIndex].subQuestions = [];
      }
      this.questions[previousIndex].subQuestions.push(this.questions[previousIndex + 1]);
      this.questions.splice(previousIndex + 1, 1);
    }
  }

  makeMainQuestion(questionId) {
    let subIndex;
    let parentIndex = this.questions.findIndex(question => {
      subIndex = question.subQuestions.findIndex(subQuestion => {
        return subQuestion.id === questionId;
      });

      return subIndex >= 0;
    });

    if (parentIndex >= 0) {
      let toInsert = this.questions[parentIndex].subQuestions.splice(subIndex, 1);
      this.questions.splice(parentIndex + 1, 0, toInsert[0]);
    }
  }
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
