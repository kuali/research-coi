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
import ConfigActions from '../../../../actions/config-actions';
import CheckBox from '../../check-box';
import Panel from '../../panel';

export default class ConfiguringPanel extends React.Component {
  constructor() {
    super();

    this.returnToProjectTypes = this.returnToProjectTypes.bind(this);
  }

  returnToProjectTypes() {
    ConfigActions.configureProjectType(undefined);
  }

  render() {
    const projectRoles = this.props.roles.map((role,index) => {
      const tmpRole = JSON.parse(JSON.stringify(role));
      tmpRole.index = index;
      return tmpRole;
    })
    .filter(role => {
      return role.projectTypeCd == this.props.projectType.typeCd; // eslint-disable-line eqeqeq
    })
    .map((role, index) => {
      return (
        <span key={index} className={styles.checkbox}>
          <CheckBox
            path={`config.projectRoles[${role.index}].reqDisclosure`}
            checked={role.reqDisclosure === 1}
            label={role.description}
          />
        </span>
      );
    });

    const projectStatuses = this.props.statuses.map((status,index) => {
      const tmpStatus = JSON.parse(JSON.stringify(status));
      tmpStatus.index = index;
      return tmpStatus;
    })
    .filter(status => {
      return status.projectTypeCd == this.props.projectType.typeCd; // eslint-disable-line eqeqeq
    })
    .map((status, index) => {
      return (
        <span key={index} className={styles.checkbox}>
          <CheckBox
            path={`config.projectStatuses[${status.index}].reqDisclosure`}
            checked={status.reqDisclosure === 1}
            label={status.description}
            key={index}
          />
        </span>
      );
    });

    return (
      <div>
        <i className={`fa fa-chevron-left ${styles.icon}`}></i>
        <button className={styles.link} onClick={this.returnToProjectTypes}>BACK TO PROJECT TYPES</button>
        <div className={styles.title}>
          {this.props.projectType.description}
        </div>
        <Panel title="Project Roles">
          {projectRoles}
        </Panel>

        <Panel title="Project Statuses">
          {projectStatuses}
        </Panel>
      </div>
    );
  }
}
