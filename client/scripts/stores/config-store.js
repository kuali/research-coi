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

import ConfigActions from '../actions/config-actions';
import alt from '../alt';
import {COIConstants} from '../../../coi-constants';
import {processResponse, createRequest} from '../http-utils';

class _ConfigStore {
  constructor() {
    this.codeMaps = {};

    this.bindActions(ConfigActions);

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
      getQuestionNumberToShow: this.getQuestionNumberToShow,
      getNewRoles: this.getNewRoles,
      getNewStatuses: this.getNewStatuses
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
      },
      selectingProjectTypes: true,
      configuringProjectType: undefined
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

  setWarningValueOnNotification([id, newValue]) {
    let targetNote;
    if (id) {
      targetNote = this.config.notifications.find(notification => { return notification.id === id; });
    }
    else {
      targetNote = this.applicationState.newNotification;
    }

    if (targetNote) {
      targetNote.warningValue = newValue;
    }
    this.dirty = true;
  }

  setWarningPeriodOnNotification([id, newValue]) {
    let targetNote;
    if (id) {
      targetNote = this.config.notifications.find(notification => { return notification.id === id; });
    }
    else {
      targetNote = this.applicationState.newNotification;
    }

    if (targetNote) {
      targetNote.warningPeriod = newValue;
    }
    this.dirty = true;
  }

  setReminderTextOnNotification([id, newValue]) {
    let targetNote;
    if (id) {
      targetNote = this.config.notifications.find(notification => { return notification.id === id; });
    }
    else {
      targetNote = this.applicationState.newNotification;
    }

    if (targetNote) {
      targetNote.reminderText = newValue;
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

  setCertificationText(newText) {
    this.config.general.certificationOptions.text = newText;
    this.dirty = true;
  }

  setCertificationRequired(newValue) {
    this.config.general.certificationOptions.required = newValue;
    this.dirty = true;
  }

  setInstructions([step, newValue]) {
    this.config.general.instructions[step] = newValue;
    this.dirty = true;
  }

  toggleInstructionsExpanded() {
    this.config.general.instructionsExpanded = !this.config.general.instructionsExpanded;
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
    const configState = this.getState();
    if (configState.codeMaps.declarationType) {
      const typeRecord = configState.codeMaps.declarationType[code];
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

  toggleAutoApprove() {
    if (this.config.general.autoApprove === undefined) {
      this.config.general.autoApprove = true;
    } else {
      this.config.general.autoApprove = !this.config.general.autoApprove;
    }
    this.dirty = true;
  }

  toggleProjectTypeRequired(typeCd) {
    const projectType = this.config.projectTypes.find(type => {
      return type.typeCd === typeCd;
    });
    projectType.reqDisclosure = projectType.reqDisclosure === 0 ? 1 : 0;
    this.dirty = true;
  }

  toggleProjectRoleRequired(typeCd) {
    const projectRole = this.config.projectRoles.find(role => {
      return role.typeCd === typeCd;
    });
    projectRole.reqDisclosure = projectRole.reqDisclosure === 0 ? 1 : 0;
    this.dirty = true;
  }

  toggleProjectStatusRequired(typeCd) {
    const projectStatus = this.config.projectStatuses.find(status => {
      return status.typeCd === typeCd;
    });
    projectStatus.reqDisclosure = projectStatus.reqDisclosure === 0 ? 1 : 0;
    this.dirty = true;
  }

  toggleSelectingProjectTypes() {
    this.applicationState.selectingProjectTypes = !this.applicationState.selectingProjectTypes;
  }

  getNewRoles(existingRoles, newRoles, projectTypeCd) {
    const existingSourceRoleCds = existingRoles.filter(existingRole => {
      return existingRole.projectTypeCd == projectTypeCd;
    })
    .map(existingRole => {
      return existingRole.sourceRoleCd;
    });

    return newRoles.filter(newRole => {
      return newRole.projectTypeCd == projectTypeCd &&
        !existingSourceRoleCds.includes(newRole.sourceRoleCd);
    });
  }

  getNewStatuses(existingStatuses, newStatuses, projectTypeCd) {
    const existingSourceStatusCds = existingStatuses.filter(existingStatus => {
      return existingStatus.projectTypeCd == projectTypeCd;
    })
    .map(existingStatus => {
      return existingStatus.sourceStatusCd;
    });

    return newStatuses.filter(newStatus => {
      return newStatus.projectTypeCd == projectTypeCd &&
        !existingSourceStatusCds.includes(newStatus.sourceStatusCd);
    });
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
          const newRoles = this.getNewRoles(this.config.projectRoles, data.body.roles, typeCd);
          if (newRoles.length > 0) {
            this.config.projectRoles = [
              ...this.config.projectRoles,
              ...newRoles
            ];
            this.dirty = true;
          }

          const newStatuses = this.getNewStatuses(this.config.projectStatuses, data.body.statuses, typeCd);
          if (newStatuses.length > 0) {
            this.config.projectStatuses = [
              ...this.config.projectStatuses,
              ...newStatuses
            ];
            this.dirty = true;
          }
          this.emitChange();
        }
      }));
  }

  setStateForTest(data) {
    this[data.key] = data.value;
  }
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
