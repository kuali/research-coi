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

import ConfigActions from '../actions/config-actions';
import alt from '../alt';
import {COIConstants} from '../../../coi-constants';
import {processResponse, createRequest} from '../http-utils';
import _ from 'lodash';

function convertToggleValue(value) {
  if (value === undefined) {
    return true;
  }
  if (typeof value === 'boolean') {
    return !value;
  }

  if (typeof value === 'number' && (value === 0 || value === 1)) {
    return value === 0 ? 1 : 0;
  }

  throw new Error('unknown toggle value');
}

class _ConfigStore {
  constructor() {
    this.codeMaps = {};

    this.bindActions(ConfigActions);

    this.exportPublicMethods({
      getDeclarationTypeString: this.getDeclarationTypeString,
      getDispositionTypeString: this.getDispositionTypeString,
      getDisclosureStatusString: this.getDisclosureStatusString,
      getAdminDisclosureStatusString: this.getAdminDisclosureStatusString,
      getDisclosureTypeString: this.getDisclosureTypeString,
      getProjectTypeString: this.getProjectTypeString,
      getRelationshipCategoryTypeString: this.getRelationshipCategoryTypeString,
      getRelationshipTypeString: this.getRelationshipTypeString,
      getRelationshipAmountString: this.getRelationshipAmountString,
      getRelationshipPersonTypeString: this.getRelationshipPersonTypeString,
      getQuestionNumberToShow: this.getQuestionNumberToShow,
      getNotificationsMode: this.getNotificationsMode,
      getDispostionsEnabled: this.getDispostionsEnabled
    });

    this.applicationState = {
      edits: {},
      declarationsTypesBeingEdited: {},
      dispositionTypesBeingEdited: {},
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
      },
      selectingProjectTypes: true,
      configuringProjectType: undefined
    };

    this.dirty = false;

    this.config = {
      dispositionTypes: [],
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
      general: [],
      projectRoles: [],
      projectStatues: []
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

  updateDeclarationType([id, newValue]) {
    this.applicationState.declarationsTypesBeingEdited[id].newValue = newValue;
    this.dirty = true;
  }

  stopEditingDeclarationType(typeCd) {
    const newValue = this.applicationState.declarationsTypesBeingEdited[typeCd].newValue;
    if (newValue) {
      this.config.declarationTypes.find(type => { return typeCd === type.typeCd; }).description = newValue;
    }
    delete this.applicationState.declarationsTypesBeingEdited[typeCd];
    this.dirty = true;
  }

  toggleDeclarationType(typeCd) {
    const typeObject = this.config.declarationTypes.find(type => { return typeCd === type.typeCd; });
    typeObject.enabled = typeObject.enabled === 1 ? 0 : 1;
    this.dirty = true;
  }

  startEditing(id) {
    this.applicationState.edits[id] = {};
    this.dirty = true;
  }

  deleteInProgressCustomDeclarationType() {
    this.applicationState.enteringNewType = false;
    this.dirty = true;
  }

  saveNewType(type) {
    // Eventually get id from server
    if (this.applicationState.edits[type]) {
      this.config[type].push({
        description: this.applicationState.edits[type].description,
        typeCd: `new${new Date().getTime()}`
      });
    }
    delete this.applicationState.edits[type];
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

  updateDisclosureType([typeCd, newValue]) {
    this.config.disclosureTypes.find(type => { return typeCd === type.typeCd; }).description = newValue;
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

  findQuestion(category, id) {
    if (id) {
      return this.config.questions[category].find(question => {
        return question.id === id;
      });
    }

    return this.applicationState.newQuestion[category];
  }

  hasSubQuestions(category, parentId) {
    return this.config.questions[category].some(question => {
      return question.parent === parentId;
    });
  }

  questionTypeChosen([category, questionId, type]) {
    let targetQuestion;
    if (questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[category][questionId];

      targetQuestion.showWarning = this.hasSubQuestions(category, targetQuestion.id) && type !== COIConstants.QUESTION_TYPE.YESNO;
    }
    else {
      targetQuestion = this.applicationState.newQuestion[category];
    }

    targetQuestion.question.type = type;
    this.dirty = true;
  }

  questionTextChanged([category, questionId, text]) {
    let targetQuestion;
    if (questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[category][questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[category];
    }

    targetQuestion.question.text = text;
    this.dirty = true;
  }

  updateQuestions([category, questions]) {
    this.config.questions[category] = questions;
    this.dirty = true;
  }

  cancelNewQuestion(category) {
    this.applicationState.newQuestion[category] = undefined;
    this.dirty = true;
  }

  saveNewQuestion(category) {
    if (!this.applicationState.newQuestion[category].question.type) {
      return;
    }

    this.config.questions[category].filter(question => {
      return !question.parent;
    }).forEach(question => {
      question.question.order += 1;
    });

    this.applicationState.newQuestion[category].question.order = 1;
    this.applicationState.newQuestion[category].active = 1;
    this.applicationState.newQuestion[category].id = COIConstants.TMP_PLACEHOLDER + new Date().getTime();
    this.config.questions[category].push(this.applicationState.newQuestion[category]);
    this.applicationState.newQuestion[category] = undefined;
    this.dirty = true;
  }

  startNewQuestion(category) {
    this.applicationState.newQuestion[category] = {question: {}};
    this.dirty = true;
  }

  deleteQuestion([category, questionId]) {
    this.config.questions[category] = this.config.questions[category].filter(question => {
      return question.id !== questionId && question.parent !== questionId;
    });

    this.dirty = true;
  }

  removeSubQuestions(category, parentId) {
    this.config.questions[category] = this.config.questions[category].filter(question => {
      return question.parent !== parentId;
    });
  }

  saveQuestionEdit([category, questionId]) {
    const index = this.config.questions[category].findIndex(question => {
      return question.id === questionId;
    });

    const editedQuestion = this.applicationState.questionsBeingEdited[category][questionId];
    delete editedQuestion.showWarning;
    if (index !== -1) {
      this.config.questions[category][index] = editedQuestion;
    }

    if (editedQuestion.question.type !== COIConstants.QUESTION_TYPE.YESNO) {
      this.removeSubQuestions(category, editedQuestion.id);
    }

    delete this.applicationState.questionsBeingEdited[category][questionId];

    this.dirty = true;
  }

  startEditingQuestion([category, questionId]) {
    const clone = JSON.parse(JSON.stringify(this.findQuestion(category, questionId)));
    this.applicationState.questionsBeingEdited[category][questionId] = clone;

    this.dirty = true;
  }

  cancelQuestionEdit([category, questionId]) {
    delete this.applicationState.questionsBeingEdited[category][questionId];

    this.dirty = true;
  }

  criteriaChanged([category, questionId, newValue]) {
    const question = this.findQuestion(category, questionId);
    if (question) {
      question.question.displayCriteria = newValue;
    }

    this.dirty = true;
  }

  multiSelectOptionAdded([category, questionId, newValue]) {
    let targetQuestion;
    if (questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[category][questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[category];
    }

    if (!targetQuestion.question.options) {
      targetQuestion.question.options = [];
    }
    targetQuestion.question.options.push(newValue);

    this.dirty = true;
  }

  multiSelectOptionDeleted([category, questionId, optionId]) {
    let targetQuestion;
    if (questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[category][questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[category];
    }

    if (targetQuestion.question.options) {
      targetQuestion.question.options = targetQuestion.question.options.filter(option => {
        return option !== optionId;
      });
    }

    this.dirty = true;
  }

  requiredNumSelectionsChanged([category, questionId, newValue]) {
    let targetQuestion;
    if (questionId) {
      targetQuestion = this.applicationState.questionsBeingEdited[category][questionId];
    }
    else {
      targetQuestion = this.applicationState.newQuestion[category];
    }

    targetQuestion.question.requiredNumSelections = newValue;

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

  enabledChanged([typeCd, newValue]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.enabled = newValue;
    }
    this.dirty = true;
  }

  typeEnabledChanged([typeCd, newValue]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.typeEnabled = newValue;
    }
    this.dirty = true;
  }

  amountEnabledChanged([typeCd, newValue]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.amountEnabled = newValue;
    }
    this.dirty = true;
  }

  destinationEnabledChanged([typeCd, newValue]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.destinationEnabled = newValue;
    }
    this.dirty = true;
  }

  dateEnabledChanged([typeCd, newValue]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.dateEnabled = newValue;
    }
    this.dirty = true;
  }

  reasonEnabledChanged([typeCd, newValue]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.reasonEnabled = newValue;
    }
    this.dirty = true;
  }

  typeOptionsChanged([typeCd, newList]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.typeOptions = newList;
    }
    this.dirty = true;
  }

  amountOptionsChanged([typeCd, newList]) {
    const target = this.config.matrixTypes.find(matrixType => {
      return matrixType.typeCd === typeCd;
    });

    if (target) {
      target.amountOptions = newList;
    }
    this.dirty = true;
  }

  set(data) {
    _.set(this, data.path, data.value);

    this.dirty = data.dirty === false ? false : true;
  }

  toggle(path) {
    _.set(this, path, convertToggleValue(_.result(this, path)));
    this.dirty = true;
  }

  moveArrayElement(data) {
    const array = _.result(this, data.path);
    const o = JSON.parse(JSON.stringify(array[data.index + data.direction]));
    array[data.index + data.direction] = array[data.index];
    array[data.index] = o;
    _.set(data.path, array);
    this.dirty = true;
  }

  removeFromArray(data) {
    const array = _.result(this, data.path);
    array.splice(data.index,1);
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

    this.codeMaps.dispositionType = {};
    this.config.dispositionTypes.forEach(typeRecord => {
      this.codeMaps.dispositionType[typeRecord.typeCd] = typeRecord;
    });

    this.isLoaded = true;
  }

  loadAllConfigData() {
    // Then load config and re-render
    createRequest().get('/api/coi/config')
    .end(processResponse((err, config) => {
      if (!err) {
        this.config = config.body;
        if (this.config.general.instructionsExpanded === undefined) {
          this.config.general.instructionsExpanded = true;
        }

        const projectsRequiringDisclosure = this.config.projectTypes.filter(projectType => {
          return projectType.reqDisclosure === 1;
        });

        if (projectsRequiringDisclosure.length > 0) {
          this.applicationState.selectingProjectTypes = false;
        }

        this.mapCodes();

        this.emitChange();
      }
    }));
    this.dirty = false;
  }

  loadConfig(id) {
    createRequest().get(`/api/coi/archived-config/${id}`)
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

    this.config.dispositionTypes.forEach(dispositionType => {
      if (typeof dispositionType.typeCd === 'string' && dispositionType.typeCd.indexOf('new') === 0) {
        delete dispositionType.typeCd;
      }
    });

    this.config.notifications.forEach(notification => {
      if (typeof notification.id === 'string' && notification.id.indexOf('new') === 0) {
        delete notification.id;
      }
    });
  }

  updateOrder() {
    this.config.dispositionTypes = this.config.dispositionTypes.map((type,index) => {
      type.order = index;
      return type;
    });

    this.config.declarationTypes = this.config.declarationTypes.map((type,index) => {
      type.order = index;
      return type;
    });
  }

  saveAll() {
    this.clearTemporaryIds();
    this.updateOrder();
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
    const configState = this.getState();
    if (configState.codeMaps.declarationType) {
      const typeRecord = configState.codeMaps.declarationType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getDispositionTypeString(code) {
    const configState = this.getState();
    if (configState.codeMaps.dispositionType) {
      const typeRecord = configState.codeMaps.dispositionType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getDisclosureStatusString(code) {
    const configState = this.getState();
    if (configState.codeMaps.disclosureStatus) {
      const typeRecord = configState.codeMaps.disclosureStatus[code];
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
    const configState = this.getState();
    if (configState.codeMaps.disclosureType) {
      const typeRecord = configState.codeMaps.disclosureType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getProjectTypeString(code) {
    const configState = this.getState();
    if (configState.codeMaps.projectType) {
      const typeRecord = configState.codeMaps.projectType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getRelationshipCategoryTypeString(code) {
    const configState = this.getState();
    if (configState.codeMaps.relationshipCategoryType) {
      const typeRecord = configState.codeMaps.relationshipCategoryType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getRelationshipTypeString(categoryCode, typeCode) {
    const typeRecord = this.getState().codeMaps.relationshipCategoryType[categoryCode];
    if (typeRecord) {
      const option = typeRecord.typeOptions.find(typeOption => {
        return typeOption.typeCd === typeCode;
      });
      if (option) {
        return option.description;
      }
    }

    return 'Undefined';
  }

  getRelationshipAmountString(categoryCode, typeCode) {
    const typeRecord = this.getState().codeMaps.relationshipCategoryType[categoryCode];
    if (typeRecord) {
      const option = typeRecord.amountOptions.find(amountOption => {
        return amountOption.typeCd === typeCode;
      });
      if (option) {
        return option.description;
      }
    }

    return 'Undefined';
  }

  getRelationshipPersonTypeString(code) {
    const configState = this.getState();
    if (configState.codeMaps.relationshipPersonType) {
      const typeRecord = configState.codeMaps.relationshipPersonType[code];
      if (typeRecord) {
        return typeRecord.description;
      }
    }
    return '';
  }

  getQuestionNumberToShow(type, questionId) {
    const configState = this.getState();
    const questions = configState.config.questions;
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
    const theQuestion = collection.find(question => {
      return question.id === questionId;
    });

    if (theQuestion) {
      return theQuestion.question.numberToShow;
    }
    return undefined;
  }

  updateRoles(data) {
    const roles = data.existingRoles;
    data.newRoles.forEach(role => {
      const existingRole = data.existingRoles.find(eRole => {
        return eRole.projectTypeCd == data.projectTypeCd && // eslint-disable-line eqeqeq
        eRole.sourceRoleCd == role.sourceRoleCd; // eslint-disable-line eqeqeq
      });

      if (existingRole) {
        if (existingRole.description != role.description) { // eslint-disable-line eqeqeq
          existingRole.description = role.description;
          this.dirty = true;
        }
      } else {
        roles.push(role);
        this.dirty = true;
      }
    });
    this.config.projectRoles = roles;
    this.emitChange();
  }

  updateStatuses(data) {
    const statuses = data.existingStatuses;
    data.newStatuses.forEach(status => {
      const existingStatus = data.existingStatuses.find(eStatus => {
        return eStatus.projectTypeCd == data.projectTypeCd && // eslint-disable-line eqeqeq
        eStatus.sourceStatusCd == status.sourceStatusCd; // eslint-disable-line eqeqeq
      });

      if (existingStatus) {
        if (existingStatus.description != status.description) { // eslint-disable-line eqeqeq
          existingStatus.description = status.description;
          this.dirty = true;
        }
      } else {
        statuses.push(status);
        this.dirty = true;
      }
    });

    this.config.projectStatuses = statuses;
    this.emitChange();
  }

  configureProjectTypeState(typeCd) {
    this.applicationState.configuringProjectType = this.config.projectTypes.find(projectType => {
      return projectType.typeCd === typeCd;
    });
  }
  configureProjectType(typeCd) {
    this.configureProjectTypeState(typeCd);

    createRequest().get(`/api/coi/new-project-data/${typeCd}`)
      .end(processResponse((err, data) => {
        if (!err) {
          this.updateRoles({
            existingRoles : this.config.projectRoles,
            newRoles: data.body.roles,
            projectTypeCd: typeCd
          });

          this.updateStatuses({
            existingStatuses: this.config.projectStatuses,
            newStatuses: data.body.statuses,
            projectTypeCd: typeCd
          });
        }
      }));
  }

  setStateForTest(data) {
    this[data.key] = data.value;
  }

  editNotificationTemplate(data) {
    if (!this.applicationState.notificationEdits) {
      this.applicationState.notificationEdits = {};
    }
    const notificationTemplate = _.result(this, data.path);
    this.applicationState.notificationEdits[notificationTemplate.templateId] = JSON.parse(JSON.stringify(notificationTemplate));
    notificationTemplate.editing = true;
  }

  cancelNotificationTemplate(data) {
    delete this.applicationState.notificationEdits[data.value];
    this.set(
      {
        dirty: false,
        path: data.path,
        value: false
      }
    );
  }

  doneNotificationTemplate(data) {
    const notificationTemplate = this.applicationState.notificationEdits[data.templateId];
    notificationTemplate.editing = false;
    this.set(
      {
        path: data.path,
        value: notificationTemplate
      }
    );
    this.dirty = true;
  }

  getNotificationsMode() {
    const configState = this.getState();
    return configState.config.notificationsMode;
  }

  getDispostionsEnabled() {
    const configState = this.getState();
    return configState.config.general.dispositionsEnabled;
  }
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
