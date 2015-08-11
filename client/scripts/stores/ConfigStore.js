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
      newNotification: {}
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
}

export default alt.createStore(_ConfigStore, 'ConfigStore');
