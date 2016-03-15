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

import styles from './style';
import React from 'react';
import Panel from '../../panel';
import ConfigStore from '../../../../stores/config-store';
import ConfigActions from '../../../../actions/config-actions';
import CheckBox from '../../check-box';
import ActiveProjectType from '../active-project-type';
import InactiveProjectType from '../inactive-project-type';
import {BlueButton} from '../../../blue-button';
import ConfiguringPanel from '../configuring-panel';
import ConfigPage from '../../config-page';

export default class DisclosureRequirements extends React.Component {
  constructor() {
    super();

    this.state = {
      applicationState: {}
    };
    this.onChange = this.onChange.bind(this);
    this.toggleSelectingProjectTypes = this.toggleSelectingProjectTypes.bind(this);
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

  toggleSelectingProjectTypes() {
    ConfigActions.toggle('applicationState.selectingProjectTypes');
  }

  render() {
    let projectTypesPanel;
    if (this.state.config && this.state.config.projectTypes && !this.state.applicationState.configuringProjectType) {
      const projectsRequiringDisclosure = this.state.config.projectTypes.filter(projectType => {
        return projectType.reqDisclosure === 1;
      });

      if (this.state.selectingProjectType) {
        const projectTypes = this.state.config.projectTypes.map((projectType, index) => {
          return (
            <CheckBox
              path={`config.projectTypes[${index}].reqDisclosure`}
              checked={projectType.reqDisclosure === 1}
              label={projectType.description}
              key={projectType.typeCd}
            />
          );
        });

        let doneButton;

        if (projectsRequiringDisclosure.length > 0) {
          doneButton = (
            <BlueButton onClick={this.toggleSelectingProjectTypes}>DONE</BlueButton>
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
          return Number(projectType.reqDisclosure) === 0;
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
              <a className={styles.link} onClick={this.toggleSelectingProjectTypes}>Click here to edit these project types</a>
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
      <ConfigPage
        title='Disclosure Requirements'
        routeName='disclosure-requirements'
        dirty={this.state.dirty}
        className={this.props.className}
      >
        {projectTypesPanel}
        {configuringPanel}
      </ConfigPage>
    );
  }
}
