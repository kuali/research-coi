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

import ConfigActions from '../actions/ConfigActions';
import {AutoBindingStore} from './AutoBindingStore';
import alt from '../alt';
import {COIConstants} from '../../../COIConstants';
import {processResponse, createRequest} from '../HttpUtils';

class _ConfigStore extends AutoBindingStore {
  constructor() {
    super(ConfigActions);

    this.codeMaps = {};

    this.exportPublicMethods({
      getDeclarationTypeString: this.getDeclarationTypeString,
      getDisclosureStatusString: this.getDisclosureStatusString,
      getAdminDisclosureStatusString: this.getAdminDisclosureStatusString,
      getDisclosureTypeString: this.getDisclosureTypeString,
      getProjectTypeString: this.getProjectTypeString,
      getRelationshipCategoryTypeString: this.getRelationshipCategoryTypeString,
      getRelationshipTypeString: this.getRelationshipTypeString,
      getRelationshipAmountString: this.getRelationshipAmountString,
      getRelationshipPersonTypeString: this.getRelationshipPersonTypeString,
      getQuestionNumberToShow: this.getQuestionNumberToShow
    });

    this.applicationState = {
      declarationsTypesBeingEdited: {},
      enteringNewType: false,
      newNotification: {
        warningPeriod: 'Days',
        warningValue: 1,
        active: true,
        id: `new${new Date().getTime()}`,
        reminderText: ''
      },
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

    this.config = {
      disclosureTypes: [],
      questions: {
        screening: [],
        entities: []
      },
      relationshipCategoryTypes: [],
      relationshipTypes: [],
      relationshipPersonType: [],
      relationshipAmountTypes: [],
      declarationTypes: [],
      notifications: [],
      general: []
    };

    this.sponsorLookup = true;

    this.dueDate = undefined;
    this.isRollingDueDate = undefined;

    this.peopleEnabled = true;

    this.certificationOptions = {
      text: '',
      required: true
    };

    this.instructions = {
    };

    this.loadAllConfigData();
  }

  startEditingDeclarationType(typeCd) {
    this.applicationState.declarationsTypesBeingEdited[typeCd] = {
      newValue: this.config.declarationTypes.find(type => { return typeCd === type.typeCd; }).text
    };
    this.dirty = true;
  }

  updateDeclarationType(params) {
    this.applicationState.declarationsTypesBeingEdited[params.id].newValue = params.newValue;
    this.dirty = true;
  }

  stopEditingDeclarationType(typeCd) {
    let newValue = this.applicationState.declarationsTypesBeingEdited[typeCd].newValue;
    if (newValue) {
      this.config.declarationTypes.find(type => { return typeCd === type.typeCd; }).description = newValue;
    }
    delete this.applicationState.declarationsTypesBeingEdited[typeCd];
    this.dirty = true;
  }

  toggleDeclarationType(typeCd) {
    let typeObject = this.config.declarationTypes.find(type => { return typeCd === type.typeCd; });
    typeObject.enabled = typeObject.enabled === 1 ? 0 : 1;
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
    if (this.applicationState.newTypeText) {
      this.config.declarationTypes.push({
        enabled: true,
        description: this.applicationState.newTypeText,
        custom: true,
        typeCd: `new${new Date().getTime()}`
      });
    }
    this.applicationState.enteringNewType = false;
    this.applicationState.newTypeText = '';
    this.dirty = true;

  }

  setNewDeclarationTypeText(newValue) {
    this.applicationState.newTypeText = newValue;
    this.dirty = true;
  }

  deleteDeclarationType(typeCd) {
    this.config.declarationTypes = this.config.declarationTypes.filter(type => {
      return type.typeCd !== typeCd;
    });
    this.dirty = true;
  }

  enableDisclosureType(typeCd) {
    this.config.disclosureTypes.find(type => { return typeCd === type.typeCd; }).enabled = 1;
    this.dirty = true;
  }

  disableDisclosureType(typeCd) {
    this.config.disclosureTypes.find(type => { return typeCd === type.typeCd; }).enabled = 0;
    this.dirty = true;
  }

  updateDisclosureType(params) {
    this.config.disclosureTypes.find(type => { return params.typeCd === type.typeCd; }).description = params.newValue;
    this.dirty = true;
  }

  enableSponsorLookup() {
    this.config.general.sponsorLookup = true;
    this.dirty = true;
  }

  disableSponsorLookup() {
    this.config.general.sponsorLookup = false;
    this.dirty = true;
  }

  setDueDate(newDate) {
    this.config.general.dueDate = newDate;
    this.dirty = true;
  }

  setIsRollingDueDate(value) {
    this.config.general.isRollingDueDate = value;
    this.dirty = true;
  }

  setWarningValueOnNotification(params) {
    let targetNote;
    if (params.id) {
      targetNote = this.config.notifications.find(notification => { return notification.id === params.id; });
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
      targetNote = this.config.notifications.find(notification => { return notification.id === params.id; });
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
      targetNote = this.config.notifications.find(notification => { return notification.id === params.id; });
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
    this.config.notifications.push(this.applicationState.newNotification);
    this.applicationState.newNotification = {
      reminderText: '',
      warningPeriod: 'Days',
      warningValue: 1,
      active: true,
      id: `new${new Date().getTime()}`
    };
    this.dirty = true;
  }

  deleteNotification(id) {
    this.config.notifications = this.config.notifications.filter(notification => {
      return notification.id !== id;
    });
    this.dirty = true;
  }

  findQuestion(category, id) {
    if (id) {
      return this.config.questions[category].find(question => {
        return question.id === id;
      });
    }
    else {
      return this.applicationState.newQuestion[category];
    }
  }

  hasSubQuestions(category, parentId) {
    return this.config.questions[category].some(question => {
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

    targetQuestion.question.type = params.type;
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

    targetQuestion.question.text = params.text;
    this.dirty = true;
  }

  updateQuestions(params) {
    this.config.questions[params.category] = params.questions;
    this.dirty = true;
  }

  cancelNewQuestion(params) {
    this.applicationState.newQuestion[params.category] = undefined;
    this.dirty = true;
  }

  saveNewQuestion(params) {
    if (!this.applicationState.newQuestion[params.category].question.type) {
      return;
    }

    this.config.questions[params.category].filter(question => {
      return !question.parent;
    }).forEach(question => {
      question.question.order += 1;
    });

    this.applicationState.newQuestion[params.category].question.order = 1;
    this.applicationState.newQuestion[params.category].active = 1;
    this.applicationState.newQuestion[params.category].id = COIConstants.TMP_PLACEHOLDER + new Date().getTime();
    this.config.questions[params.category].push(this.applicationState.newQuestion[params.category]);
    this.applicationState.newQuestion[params.category] = undefined;
    this.dirty = true;
  }

  startNewQuestion(params) {
    this.applicationState.newQuestion[params.category] = {question: {}};
    this.dirty = true;
  }

  deleteQuestion(params) {
    this.config.questions[params.category] = this.config.questions[params.category].filter(question => {
      return question.id !== params.questionId && question.parent !== params.questionId;
    });

    this.dirty = true;
  }

  removeSubQuestions(category, parentId) {
    this.config.questions[category] = this.config.questions[category].filter(question => {
      return question.parent !== parentId;
    });
  }

  saveQuestionEdit(params) {
    let index = this.config.questions[params.category].findIndex(question => {
      return question.id === params.questionId;
    });

    let editedQuestion = this.applicationState.questionsBeingEdited[params.category][params.questionId];
    delete editedQuestion.showWarning;
    if (index !== -1) {
      this.config.questions[params.category][index] = editedQuestion;
    }

    if (editedQuestion.question.type !== COIConstants.QUESTION_TYPE.YESNO) {
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
      question.question.displayCriteria = params.newValue;
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

    if (!targetQuestion.question.options) {
      targetQuestion.question.options = [];
    }
    targetQuestion.question.options.push(params.newValue);

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

    if (targetQuestion.question.options) {
      targetQuestion.question.options = targetQuestion.question.options.filter(option => {
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

    targetQuestion.question.requiredNumSelections = params.newValue;

    this.dirty = true;
  }

  relationshipPeopleChanged(newPeople) {
    this.config.relationshipPersonTypes = newPeople;
    this.dirty = true;
  }

  relationshipPeopleEnabled(newValue) {
    this.config.general.peopleEnabled = newValue;
    this.dirty = true;
  }

  enabledChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.enabled = params.newValue;
    }
    this.dirty = true;
  }

  typeEnabledChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.typeEnabled = params.newValue;
    }
    this.dirty = true;
  }

  amountEnabledChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.amountEnabled = params.newValue;
    }
    this.dirty = true;
  }

  destinationEnabledChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.destinationEnabled = params.newValue;
    }
    this.dirty = true;
  }

  dateEnabledChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.dateEnabled = params.newValue;
    }
    this.dirty = true;
  }

  reasonEnabledChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.reasonEnabled = params.newValue;
    }
    this.dirty = true;
  }

  typeOptionsChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.typeOptions = params.newList;
    }
    this.dirty = true;
  }

  amountOptionsChanged(params) {
    let target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === params.typeCd;
    });

    if (target) {
      target.amountOptions = params.newList;
    }
    this.dirty = true;
  }

  setCertificationText(newText) {
    this.config.general.certificationOptions.text = newText;
    this.dirty = true;
  }

  setCertificationRequired(newValue) {
    this.config.general.certificationOptions.required = newValue;
    this.dirty = true;
  }

  setInstructions(params) {
    this.config.general.instructions[params.step] = params.newValue;
    this.dirty = true;
  }

  mapCodes() {
    this.codeMaps.declarationType = {};
    this.config.declarationTypes.forEach(typeRecord => {
      this.codeMaps.declarationType[typeRecord.typeCd] = typeRecord;
    });

    this.codeMaps.disclosureStatus = {};
    this.config.disclosureStatus.forEach(typeRecord => {
      this.codeMaps.disclosureStatus[typeRecord.statusCd] = typeRecord;
    });

    this.codeMaps.disclosureType = {};
    this.config.disclosureTypes.forEach(typeRecord => {
      this.codeMaps.disclosureType[typeRecord.typeCd] = typeRecord;
    });

    this.codeMaps.projectType = {};
    this.config.projectTypes.forEach(typeRecord => {
      this.codeMaps.projectType[typeRecord.typeCd] = typeRecord;
    });

    this.codeMaps.relationshipCategoryType = {};
    this.config.matrixTypes.forEach(typeRecord => {
      this.codeMaps.relationshipCategoryType[typeRecord.typeCd] = typeRecord;
    });

    this.codeMaps.relationshipPersonType = {};
    this.config.relationshipPersonTypes.forEach(typeRecord => {
      this.codeMaps.relationshipPersonType[typeRecord.typeCd] = typeRecord;
    });

    this.isLoaded = true;
  }

  loadAllConfigData() {
    // Then load config and re-render
    createRequest().get('/api/coi/config')
    .end(processResponse((err, config) => {
      if (!err) {
        this.config = config.body;

        this.mapCodes();

        this.emitChange();
      }
    }));
    this.dirty = false;
  }

  loadConfig(id) {
    createRequest().get('/api/coi/archived-config/' + id)
    .end(processResponse((err, config) => {
      if (!err) {
        this.config = config.body;
        this.mapCodes();

        this.emitChange();
      }
    }));
  }

  clearTemporaryIds() {
    this.config.declarationTypes.forEach(declarationType => {
      if (typeof declarationType.typeCd === 'string' && declarationType.typeCd.indexOf('new') === 0) {
        delete declarationType.typeCd;
      }
    });

    this.config.notifications.forEach(notification => {
      if (typeof notification.id === 'string' && notification.id.indexOf('new') === 0) {
        delete notification.id;
      }
    });
  }

  saveAll() {
    this.clearTemporaryIds();

    createRequest().post('/api/coi/config')
    .send(this.config)
    .type('application/json')
    .end(processResponse((err, config) => {
      if (!err) {
        this.config = config.body;
        this.emitChange();
      }
    }));
    this.dirty = false;
  }

  undoAll() {
    this.loadAllConfigData();
  }

  getDeclarationTypeString(code) {
    let configState = this.getState();
    if (configState.codeMaps.declarationType) {
      let typeRecord = configState.codeMaps.declarationType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getDisclosureStatusString(code) {
    let configState = this.getState();
    if (configState.codeMaps.disclosureStatus) {
      let typeRecord = configState.codeMaps.disclosureStatus[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getAdminDisclosureStatusString(code) {
    switch(code) {
      case 1:
      case 3:
        return 'Approved';
      case 4:
        return 'Sent back';
      default:
        return this.getDisclosureStatusString(code);
    }
  }

  getDisclosureTypeString(code) {
    let configState = this.getState();
    if (configState.codeMaps.disclosureType) {
      let typeRecord = configState.codeMaps.disclosureType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getProjectTypeString(code) {
    let configState = this.getState();
    if (configState.codeMaps.projectType) {
      let typeRecord = configState.codeMaps.projectType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getRelationshipCategoryTypeString(code) {
    let configState = this.getState();
    if (configState.codeMaps.relationshipCategoryType) {
      let typeRecord = configState.codeMaps.relationshipCategoryType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getRelationshipTypeString(categoryCode, typeCode) {
    let typeRecord = this.getState().codeMaps.relationshipCategoryType[categoryCode];
    if (typeRecord) {
      let option = typeRecord.typeOptions.find(typeOption => {
        return typeOption.typeCd === typeCode;
      });
      if (option) {
        return option.description;
      } else {
        return 'Undefined';
      }
    }
    else {
      return 'Undefined';
    }
  }

  getRelationshipAmountString(categoryCode, typeCode) {
    let typeRecord = this.getState().codeMaps.relationshipCategoryType[categoryCode];
    if (typeRecord) {
      let option = typeRecord.amountOptions.find(amountOption => {
        return amountOption.typeCd === typeCode;
      });
      if (option) {
        return option.description;
      } else {
        return 'Undefined';
      }
    }
    else {
      return 'Undefined';
    }
  }

  getRelationshipPersonTypeString(code) {
    let configState = this.getState();
    if (configState.codeMaps.relationshipPersonType) {
      let typeRecord = configState.codeMaps.relationshipPersonType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getQuestionNumberToShow(type, questionId) {
    let configState = this.getState();
    let questions = configState.config.questions;
    let collection;
    switch (type) {
      case COIConstants.QUESTIONNAIRE_TYPE.SCREENING:
        collection = questions.screening;
        break;
      case COIConstants.QUESTIONNAIRE_TYPE.ENTITIES:
        collection = questions.entities;
        break;
      default:
        return undefined;
    }
    let theQuestion = collection.find(question => {
      return question.id === questionId;
    });

    if (theQuestion) {
      return theQuestion.question.numberToShow;
    }
    else {
      return undefined;
    }
  }
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
