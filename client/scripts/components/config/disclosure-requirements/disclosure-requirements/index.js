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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import Sidebar from '../../sidebar';
import Panel from '../../panel';
import ActionPanel from '../../action-panel';
import ConfigStore from '../../../../stores/config-store';
import ConfigActions from '../../../../actions/config-actions';
import {AppHeader} from '../../../app-header';
import CheckBox from '../check-box';
import ActiveProjectType from '../active-project-type';
import InactiveProjectType from '../inactive-project-type';
import {BlueButton} from '../../../blue-button';
import ConfiguringPanel from '../configuring-panel';
export default class DisclosureRequirements extends React.Component {
  constructor() {
    super();

    this.state = {
      applicationState: {}
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.onChange();
    ConfigStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = ConfigStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      config: storeState.config,
      dirty: storeState.dirty,
      selectingProjectType: storeState.applicationState.selectingProjectTypes
    });
  }

  render() {
    let projectTypesPanel;
    if (this.state.config && this.state.config.projectTypes && !this.state.applicationState.configuringProjectType) {
      const projectsRequiringDisclosure = this.state.config.projectTypes.filter(projectType => {
        return projectType.reqDisclosure === 1;
      });

      if (this.state.selectingProjectType) {
        const projectTypes = this.state.config.projectTypes.map(projectType => {
          return (
            <CheckBox
              {...projectType}
              type="projectType"
              projectTypeCd={projectType.typeCd}
              key={projectType.typeCd}
              toggle={ConfigActions.toggleProjectTypeRequired}
            />
          );
        });

        let doneButton;

        if (projectsRequiringDisclosure.length > 0) {
          doneButton = (
            <BlueButton onClick={ConfigActions.toggleSelectingProjectTypes}>DONE</BlueButton>
          );
        }
        projectTypesPanel = (
          <div>
            <div className={styles.title}>
              Choose from the project types below <br/>
              which require the completion of a COI disclosure
            </div>

            <Panel>
              {projectTypes}
              <div style={{textAlign: 'center'}}>
                {doneButton}
              </div>
            </Panel>
          </div>
        );
      } else {
        const activeProjectTypes = projectsRequiringDisclosure.map(projectType => {
          return (
            <ActiveProjectType
              {...projectType}
              key={projectType.typeCd}
              configure={ConfigActions.configureProjectType}
            />
          );
        });

        const inactiveProjectTypes = this.state.config.projectTypes.filter(projectType => {
          return projectType.reqDisclosure == 0;
        })
        .map(projectType => {
          return (
            <InactiveProjectType
              {...projectType}
              key={projectType.typeCd}
            />
          );
        });

        projectTypesPanel = (
          <div>
            <div className={styles.title}>
              The project types below require the completion of a COI disclosure.<br/>
              <a className={styles.link} onClick={ConfigActions.toggleSelectingProjectTypes}>Click here to edit these project types</a>
            </div>
            <div>
              <div style={{marginBottom: '50px'}}>
                <div className={styles.activeHeader}>
                  ACTIVE
                </div>
                {activeProjectTypes}
              </div>
              <div>
                <div className={styles.activeHeader} style={{marginBottom: '15px'}}>
                  NOT ACTIVE
                </div>
                {inactiveProjectTypes}
              </div>

            </div>
          </div>
        );
      }
    }

    let configuringPanel;
    if (this.state.applicationState.configuringProjectType) {
      configuringPanel = (
        <ConfiguringPanel
          projectType={this.state.applicationState.configuringProjectType}
          roles={this.state.config.projectRoles}
          statuses={this.state.config.projectStatuses}
        />
      );
    }

    return (
      <div className={`flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={classNames('fill', 'flexbox', 'row', styles.container, this.props.className)}>
          <Sidebar active="disclosure-requirements" />
          <span className={`inline-flexbox column fill ${styles.content}`}>
            <div className={styles.stepTitle}>
              Disclosure Requirements
            </div>
            <div className={`fill flexbox row ${styles.configurationArea}`}>
              <span className={`fill`} style={{display: 'inline-block'}}>
                {projectTypesPanel}
                {configuringPanel}
              </span>
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </span>
      </div>
    );
  }
}
