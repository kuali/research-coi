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
import {
  QUESTION_TYPE,
  QUESTIONNAIRE_TYPE,
  TMP_PLACEHOLDER
} from '../../../coi-constants';
import {processResponse, createRequest} from '../http-utils';
import { prepareInstructionsForSave, createEditorStates } from '../editor-utils';
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

export function getCodeMap(items, codeField) {
  let result = {};
  if (Array.isArray(items)) {
    result = items.reduce((map, typeRecord) => {
      if (!(codeField in typeRecord)) {
        throw new Error(`Invalid codeField supplied: ${codeField}`);
      }
      map[typeRecord[codeField]] = typeRecord;
      return map;
    }, result);
  }

  return result;
}

export function mapCodes(config) {
  if (!_.isObjectLike(config)) {
    throw new Error('invalid config object');
  }

  const codeMaps = {
    declarationType: getCodeMap(config.declarationTypes, 'typeCd'),
    disclosureStatus: getCodeMap(config.disclosureStatus, 'statusCd'),
    disclosureType: getCodeMap(config.disclosureTypes, 'typeCd'),
    projectType: getCodeMap(config.projectTypes, 'typeCd'),
    relationshipCategoryType: getCodeMap(config.matrixTypes, 'typeCd'),
    relationshipPersonType: getCodeMap(config.relationshipPersonTypes, 'typeCd'),
    dispositionTypes: getCodeMap(config.dispositionTypes, 'typeCd')
  };

  return codeMaps;
}

function getConfig(state, configId) {
  if (state.config.id === configId) {
    return state.config;
  } else if (state.archivedConfigs[configId] !== undefined) {
    return state.archivedConfigs[configId];
  }

  throw new Error('Invalid config id');
}

export function getCodeMapsFromState(...args) {
  return getConfig(...args).codeMaps;
}

export function getStringFromCodeMap(state, code, configId, mapName) {
  if (!_.isObjectLike(state)) {
    throw new Error('invalid state');
  }
  const codeMaps = getCodeMapsFromState(state, configId);
  if (Object.keys(codeMaps).length === 0) {
    throw new Error('invalid configId');
  }

  if (!_.isObjectLike(codeMaps[mapName])) {
    throw new Error('invalid code map name');
  }

  const mapRecord = codeMaps[mapName][code];
  if (mapRecord) {
    return mapRecord.description;
  }

  return '';
}

export function getDisclosureTypeString(...args) {
  return getStringFromCodeMap(...args, 'disclosureType');
}

export function getDispositionsEnabled(state) {
  if (!_.isObjectLike(state)) {
    throw new Error('Invalid state');
  }
  return state.config.general.dispositionsEnabled;
}

export function getDisclosureStatusString(...args) {
  return getStringFromCodeMap(...args, 'disclosureStatus');
}

export function getAdminDisclosureStatusString(state, code, configId) {
  switch(code) {
    case 1:
    case 3:
      return 'Approved';
    case 4:
      return 'Sent back';
    default:
      return getDisclosureStatusString(state, code, configId);
  }
}

export function getRelationshipPersonTypeString(...args) {
  return getStringFromCodeMap(...args, 'relationshipPersonType');
}

export function getRelationshipCategoryTypeString(...args) {
  return getStringFromCodeMap(...args, 'relationshipCategoryType');
}

export function getProjectTypeString(...args) {
  return getStringFromCodeMap(...args, 'projectType');
}

export function getDeclarationTypeString(...args) {
  return getStringFromCodeMap(...args, 'declarationType');
}

export function getDispositionTypeString(...args) {
  return getStringFromCodeMap(...args, 'dispositionType');
}

function getFieldFromRelationship(state, categoryCode, typeCode, configId, field) {
  if (!_.isObjectLike(state)) {
    throw new Error('Invalid state');
  }

  const codeMaps = getCodeMapsFromState(state, configId);

  const typeRecord = codeMaps.relationshipCategoryType[categoryCode];
  if (!typeRecord) {
    throw new Error('Invalid categoryCode');
  }

  const option = typeRecord[field].find(typeOption => {
    return typeOption.typeCd === typeCode;
  });
  if (!option) {
    throw new Error('Invalid typeCode');
  }

  return option.description;
}

export function getRelationshipTypeString(...args) {
  return getFieldFromRelationship(...args, 'typeOptions');
}

export function getRelationshipAmountString(...args) {
  return getFieldFromRelationship(...args, 'amountOptions');
}

export function getNotificationsMode(state) {
  if (!_.isObjectLike(state)) {
    throw new Error('Invalid state');
  }

  return state.config.notificationsMode;
}

export function getQuestionNumberToShow(state, type, questionId, configId) {
  if (!_.isObjectLike(state)) {
    throw new Error('Invalid state');
  }

  const config = getConfig(state, configId);
  const {questions} = config;

  let collection;
  switch (type) {
    case QUESTIONNAIRE_TYPE.SCREENING:
      collection = questions.screening;
      break;
    case QUESTIONNAIRE_TYPE.ENTITIES:
      collection = questions.entities;
      break;
    default:
      throw new Error('Invalid type');
  }
  const theQuestion = collection.find(question => question.id === questionId);

  if (!theQuestion) {
    throw new Error('Question not found');
  }
  return theQuestion.question.numberToShow;
}

export function getLane(state) {
  if (!_.isObjectLike(state)) {
    throw new Error('Invalid state');
  }

  return state.config.lane;
}

class _ConfigStore {
  constructor() {
    this.bindActions(ConfigActions);

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

    this.archivedConfigs = {};

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

    this.editorStates = {};
    this.loadAllConfigData();
  }

  updateEditorState([key, editorState]) {
    this.editorStates[key] = editorState;
    this.dirty = true;
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
        typeCd: `new${new Date().getTime()}`,
        active: 1
      });
    }
    delete this.applicationState.edits[type];
    this.dirty = true;
  }

  saveNewTypeAndAddMore(type) {
    this.saveNewType(type);
    this.startEditing(type);
    this.applicationState.edits[type].description = '';
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

      targetQuestion.showWarning = this.hasSubQuestions(category, targetQuestion.id) && type !== QUESTION_TYPE.YESNO;
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
    this.applicationState.newQuestion[category].id = TMP_PLACEHOLDER + new Date().getTime();
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

    if (editedQuestion.question.type !== QUESTION_TYPE.YESNO) {
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

  deactivateType(data) {
    const array = _.result(this, data.path);
    array[data.index].active = 0;
    this.dirty = true;
  }

  reactivateType(data) {
    const array = _.result(this, data.path);
    array[data.index].active = 1;
    this.dirty = true;
  }

  loadAllConfigData() {
    // Then load config and re-render
    createRequest()
      .get('/api/coi/config')
      .end(processResponse((err, config) => {
        if (!err) {
          this.config = config.body;
          this.editorStates = createEditorStates(this.config.general.instructions, this.config.general.richTextInstructions);

          if (this.config.general.instructionsExpanded === undefined) {
            this.config.general.instructionsExpanded = true;
          }

          const projectsRequiringDisclosure = this.config.projectTypes.filter(projectType => {
            return projectType.reqDisclosure === 1;
          });

          if (projectsRequiringDisclosure.length > 0) {
            this.applicationState.selectingProjectTypes = false;
          }

          this.config.codeMaps = mapCodes(this.config);
          this.isLoaded = true;
          this.emitChange();
        }
      }));

    this.dirty = false;
  }

  loadConfig(id) {
    if (this.archivedConfigs[id]) {
      this.emitChange();
      return;
    }

    createRequest()
      .get(`/api/coi/archived-config/${id}`)
      .end(processResponse((err, config) => {
        if (!err) {
          this.archivedConfigs[id] = config.body;
          this.archivedConfigs[id].codeMaps = mapCodes(this.archivedConfigs[id]);
          this.isLoaded = true;
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
    this.config.general.richTextInstructions = prepareInstructionsForSave(this.editorStates);

    createRequest()
      .post('/api/coi/config')
      .send(this.config)
      .type('application/json')
      .end(processResponse((err, config) => {
        if (!err) {
          this.archivedConfigs[this.config.id] = this.config;
          this.config = config.body;
          this.emitChange();
        }
      }));

    this.dirty = false;
  }

  undoAll() {
    this.loadAllConfigData();
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
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
