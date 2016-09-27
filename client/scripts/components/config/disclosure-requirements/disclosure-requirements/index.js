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

    this.toggleSelectingProjectTypes = this.toggleSelectingProjectTypes.bind(this);
  }

  toggleSelectingProjectTypes() {
    ConfigActions.toggle('applicationState.selectingProjectTypes');
  }

  render() {
    const {configState} = this.context;
    let projectTypesPanel;
    if (
      configState.config &&
      configState.config.projectTypes &&
      !configState.applicationState.configuringProjectType
    ) {
      const projectsRequiringDisclosure = configState.config.projectTypes.filter(projectType => {
        return projectType.reqDisclosure === 1;
      });

      if (configState.applicationState.selectingProjectTypes) {
        const projectTypes = configState.config.projectTypes.map((projectType, index) => {
          return (
            <span key={projectType.typeCd} className={styles.checkbox}>
              <CheckBox
                path={`config.projectTypes[${index}].reqDisclosure`}
                checked={projectType.reqDisclosure === 1}
                label={projectType.description}
              />
            </span>
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
              Choose from the project types below <br />
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

        const inactiveProjectTypes = configState.config.projectTypes.filter(projectType => {
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
              The project types below require the completion of a COI disclosure.<br />
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
    if (configState.applicationState.configuringProjectType) {
      configuringPanel = (
        <ConfiguringPanel
          projectType={configState.applicationState.configuringProjectType}
          roles={configState.config.projectRoles}
          statuses={configState.config.projectStatuses}
        />
      );
    }

    return (
      <ConfigPage
        title='Disclosure Requirements'
        routeName='disclosure-requirements'
        dirty={configState.dirty}
        className={this.props.className}
      >
        {projectTypesPanel}
        {configuringPanel}
      </ConfigPage>
    );
  }
}

DisclosureRequirements.contextTypes = {
  configState: React.PropTypes.object
};