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

  describe('toggleAutoApprove', () => {
    const testToggleAutoApprove = (intial, expected) => {
      setState({
        key: 'config',
        value: {
          general: {
            autoApprove: intial
          }
        }
      });
      let state = ConfigStore.getState();

      assert.equal(state.config.general.autoApprove, intial);
      assert.equal(state.dirty, false);
      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE_AUTO_APPROVE,
        data: {}
      });

      state = ConfigStore.getState();
      assert.equal(state.config.general.autoApprove, expected);
      assert.equal(state.dirty, true);
    };

    it('should toggle value of autoApprove to true if undefined', () => {
      testToggleAutoApprove(undefined, true);
    });

    it('should toggle value of autoApprove to true if false', () => {
      testToggleAutoApprove(false, true);
    });

    it('should toggle value of autoApprove to false if true', () => {
      testToggleAutoApprove(true, false);
    });
  });


  describe('toggleProjectTypeRequired', () => {
    it('should toggle the value of reqDisclosure for the project type with the typeCd of the value passed in', () => {
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
      let state = ConfigStore.getState();
      assert.equal(state.config.projectTypes[0].reqDisclosure, 0);

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE_PROJECT_TYPE_REQUIRED,
        data: 1
      });

      state = ConfigStore.getState();
      assert.equal(state.config.projectTypes[0].reqDisclosure, 1);
      assert.equal(state.dirty, true);

    });
  });

  describe('toggleProjectRoleRequired', () => {
    it('should toggle the value of reqDisclosure for the project role with the typeCd of the value passed in', () => {
      setState({
        key: 'config',
        value: {
          projectRoles: [
            {
              typeCd: 1,
              description: 'test',
              reqDisclosure: 0
            }
          ]
        }
      });
      let state = ConfigStore.getState();
      assert.equal(state.config.projectRoles[0].reqDisclosure, 0);

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE_PROJECT_ROLE_REQUIRED,
        data: 1
      });

      state = ConfigStore.getState();
      assert.equal(state.config.projectRoles[0].reqDisclosure, 1);
      assert.equal(state.dirty, true);

    });
  });

  describe('toggleProjectStatusRequired', () => {
    it('should toggle the value of reqDisclosure for the project status with the typeCd of the value passed in', () => {
      setState({
        key: 'config',
        value: {
          projectStatuses: [
            {
              typeCd: 1,
              description: 'test',
              reqDisclosure: 0
            }
          ]
        }
      });
      let state = ConfigStore.getState();
      assert.equal(state.config.projectStatuses[0].reqDisclosure, 0);

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE_PROJECT_STATUS_REQUIRED,
        data: 1
      });

      state = ConfigStore.getState();
      assert.equal(state.config.projectStatuses[0].reqDisclosure, 1);
      assert.equal(state.dirty, true);

    });
  });

  describe('toggleEditingProjectTypes', () => {
    it('should toggle the value of editingProjectTypes', () => {
      setState({
        key: 'applicationState',
        value: {
          selectingProjectTypes: false
        }
      });
      let selectingProjectTypes = ConfigStore.getState().applicationState.selectingProjectTypes;
      assert.equal(selectingProjectTypes, false);

      alt.dispatcher.dispatch({
        action: ConfigActions.TOGGLE_SELECTING_PROJECT_TYPES
      });

      selectingProjectTypes = ConfigStore.getState().applicationState.selectingProjectTypes;
      assert.equal(selectingProjectTypes, true);

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
      assert.equal(2, roles.filter(role => role.sourceRoleCd == 'KP').length);
      assert.equal('Principle Investigator', roles.find(role => role.sourceRoleCd == 'PI').description);
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
      assert.equal(2, statuses.filter(status => status.sourceStatusCd == '3').length);
      assert.equal('In Progress', statuses.find(status => status.sourceStatusCd == '1').description);
    });
  });
});
