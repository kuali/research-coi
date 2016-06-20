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

import alt from '../../../../client/scripts/alt';
import assert from 'assert';
import ConfigStore from '../../../../client/scripts/stores/config-store';
import ConfigActions from '../../../../client/scripts/actions/config-actions';

const setState = (data) => {
  alt.dispatcher.dispatch({
    action: ConfigActions.SET_STATE_FOR_TEST, data
  });
};

describe('ConfigStore', () => {
  beforeEach(() => {
    alt.recycle(ConfigStore);
  });

  describe('setStateForTest', () => {
    it('should update state with values passed in', () => {
      setState({
        key: 'testStuff',
        value: true
      });
      const state = ConfigStore.getState();
      assert.equal(state.testStuff, true);
    });
  });

  describe('toggle', () => {
    it('should toggle boolean value', () => {
      setState({
        key: 'config',
        value: {
          general: {
            autoApprove: true
          }
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE,
        data: 'config.general.autoApprove'
      });

      const autoApprove = ConfigStore.getState().config.general.autoApprove;
      assert.equal(false, autoApprove);
    });

    it('should toggle numeric value', () => {
      setState({
        key: 'config',
        value: {
          general: {
            autoApprove: 1
          }
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE,
        data: 'config.general.autoApprove'
      });

      const autoApprove = ConfigStore.getState().config.general.autoApprove;
      assert.equal(0, autoApprove);
    });

    it('should toggle values in arrays', () => {
      setState({
        key: 'config',
        value: {
          general: [{
            autoApprove: 1
          }]
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE,
        data: 'config.general[0].autoApprove'
      });

      const autoApprove = ConfigStore.getState().config.general[0].autoApprove;
      assert.equal(0, autoApprove);
    });

    it('should toggle values in map', () => {
      setState({
        key: 'config',
        value: {
          general: {
            autoApprove: 1
          }
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE,
        data: 'config.general[\'autoApprove\']'
      });

      const autoApprove = ConfigStore.getState().config.general.autoApprove;
      assert.equal(0, autoApprove);
    });
  });

  describe('set', () => {
    it('should set values', () => {
      setState({
        key: 'config',
        value: {
          general: {
            text: 'Panda Dogs'
          }
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.SET,
        data: {
          path: 'config.general.text',
          value: 'Dragon Cats'
        }
      });

      const text = ConfigStore.getState().config.general.text;
      assert.equal('Dragon Cats', text);
    });

    it('should set values in arrays', () => {
      setState({
        key: 'config',
        value: {
          general: [{
            text: 'Panda Dogs'
          }]
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.SET,
        data: {
          path: 'config.general[0].text',
          value: 'Dragon Cats'
        }
      });

      const text = ConfigStore.getState().config.general[0].text;
      assert.equal('Dragon Cats', text);
    });

    it('should set values as map', () => {
      setState({
        key: 'config',
        value: {
          general: [{
            text: 'Panda Dogs'
          }]
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.SET,
        data: {
          path: 'config.general[\'text\']',
          value: 'Dragon Cats'
        }
      });

      const text = ConfigStore.getState().config.general.text;
      assert.equal('Dragon Cats', text);
    });
  });

  describe('configureProjectTypeState', () => {
    it('should set the value of configuringProjectType', () => {
      setState({
        key: 'config',
        value: {
          projectTypes: [
            {
              typeCd: 1,
              description: 'test',
              reqDisclosure: 0
            }
          ]
        }
      });

      setState({
        key: 'applicationState',
        value: {}
      });

      let configuringProjectType = ConfigStore.getState().applicationState.configuringProjectType;
      assert.equal(configuringProjectType, undefined);

      alt.dispatcher.dispatch({
        action: ConfigActions.CONFIGURE_PROJECT_TYPE_STATE,
        data: 1
      });

      configuringProjectType = ConfigStore.getState().applicationState.configuringProjectType;
      assert.equal(configuringProjectType.typeCd, 1);
    });
  });

  describe('getNewRoles', () => {
    it('should only return roles that exist in newRoles but not existingRoles', () => {
      const newRoles = [
        {
          projectTypeCd: '1',
          sourceRoleCd: 'KP',
          description: 'Key Person'
        },
        {
          projectTypeCd: '1',
          sourceRoleCd: 'COI',
          description: 'Co-Investigator'
        },
        {
          projectTypeCd: '1',
          sourceRoleCd: 'PI',
          description: 'Principle Investigator'
        },
        {
          projectTypeCd: '2',
          sourceRoleCd: 'KP',
          description: 'Key Person'
        }
      ];

      const existingRoles = [
        {
          projectTypeCd: '1',
          sourceRoleCd: 'COI',
          description: 'Co-Investigator'
        },
        {
          projectTypeCd: '1',
          sourceRoleCd: 'PI',
          description: 'CAT DOG'
        },
        {
          projectTypeCd: '2',
          sourceRoleCd: 'KP',
          description: 'Key Person'
        }
      ];

      alt.dispatcher.dispatch({
        action: ConfigActions.UPDATE_ROLES,
        data: {
          existingRoles,
          newRoles,
          projectTypeCd: '1'
        }
      });

      const roles = ConfigStore.getState().config.projectRoles;
      assert.equal(4, roles.length);
      assert.equal(2, roles.filter(role => String(role.sourceRoleCd) === 'KP').length);
      assert.equal('Principle Investigator', roles.find(role => String(role.sourceRoleCd) === 'PI').description);
    });
  });

  describe('getNewStatuses', () => {
    it('should only return statuses that exist in newStatuses but not existingStatuses', () => {
      const newStatuses = [
        {
          projectTypeCd: '1',
          sourceStatusCd: '1',
          description: 'In Progress'
        },
        {
          projectTypeCd: '1',
          sourceStatusCd: '2',
          description: 'Submitted'
        },
        {
          projectTypeCd: '1',
          sourceStatusCd: '3',
          description: 'Approved'
        },
        {
          projectTypeCd: '2',
          sourceStatusCd: '3',
          description: 'Approved'
        }
      ];

      const existingStatuses = [
        {
          projectTypeCd: '1',
          sourceStatusCd: '1',
          description: 'IN_PROGRESS'
        },
        {
          projectTypeCd: '1',
          sourceStatusCd: '2',
          description: 'Submitted'
        },
        {
          projectTypeCd: '2',
          sourceStatusCd: '3',
          description: 'Approved'
        }
      ];

      alt.dispatcher.dispatch({
        action: ConfigActions.UPDATE_STATUSES,
        data: {
          existingStatuses,
          newStatuses,
          projectTypeCd: '1'
        }
      });

      const statuses = ConfigStore.getState().config.projectStatuses;
      assert.equal(4, statuses.length);
      assert.equal(2, statuses.filter(status => String(status.sourceStatusCd) === '3').length);
      assert.equal('In Progress', statuses.find(status => String(status.sourceStatusCd) === '1').description);
    });
  });

  describe('startEditing', () => {
    it('should create a key in the edits object for the id passed in', () => {
      alt.dispatcher.dispatch({
        action: ConfigActions.START_EDITING,
        data: 'disclosureType'

      });

      const edits = ConfigStore.getState().applicationState.edits;
      assert(edits.disclosureType !== undefined);
    });
  });

  describe('saveNewType', () => {
    it('should add new disposition to config', () => {
      setState({
        key: 'applicationState',
        value: {
          edits: {
            dispositionTypes: {
              description: 'test'
            }
          }
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.SAVE_NEW_TYPE,
        data: 'dispositionTypes'
      });

      const state = ConfigStore.getState();
      assert.equal(1, state.config.dispositionTypes.length);
      assert.equal('test', state.config.dispositionTypes[0].description);
      assert.equal(true, state.dirty);
      assert.equal(undefined, state.applicationState.edits.dispositionType);
    });
  });

  describe('moveArrayElement down', () => {
    it('should move item in the direction specfied', () => {
      setState({
        key: 'config',
        value: {
          dispositionTypes: [
            {
              name: 'one'
            },
            {
              name: 'two'
            },
            {
              name: 'three'
            }
          ]
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.MOVE_ARRAY_ELEMENT,
        data: {
          path: 'config.dispositionTypes',
          index: 1,
          direction: 1
        }
      });

      const dispositionTypes = ConfigStore.getState().config.dispositionTypes;

      assert.equal(3, dispositionTypes.length);
      assert.equal('two', dispositionTypes[2].name);
      assert.equal('three', dispositionTypes[1].name);
    });
  });

  describe('moveArrayElement down', () => {
    it('should move item in the direction specfied', () => {
      setState({
        key: 'config',
        value: {
          dispositionTypes: [
            {
              name: 'one'
            },
            {
              name: 'two'
            },
            {
              name: 'three'
            }
          ]
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.MOVE_ARRAY_ELEMENT,
        data: {
          path: 'config.dispositionTypes',
          index: 1,
          direction: -1
        }
      });

      const dispositionTypes = ConfigStore.getState().config.dispositionTypes;

      assert.equal(3, dispositionTypes.length);
      assert.equal('two', dispositionTypes[0].name);
      assert.equal('one', dispositionTypes[1].name);
    });
  });

  describe('removeFromArray', () => {
    it('should remove the element from the array', () => {
      setState({
        key: 'config',
        value: {
          dispositionTypes: [
            {
              name: 'one'
            },
            {
              name: 'two'
            },
            {
              name: 'three'
            }
          ]
        }
      });

      alt.dispatcher.dispatch({
        action: ConfigActions.REMOVE_FROM_ARRAY,
        data: {
          path: 'config.dispositionTypes',
          index: 0
        }
      });

      const dispositionTypes = ConfigStore.getState().config.dispositionTypes;

      assert.equal(2, dispositionTypes.length);
      assert.equal('two', dispositionTypes[0].name);
      assert.equal('three', dispositionTypes[1].name);
    });
  });
});

