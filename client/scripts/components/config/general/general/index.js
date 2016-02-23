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
import DisclosureTypes from '../disclosure-types';
import ConfigStore from '../../../../stores/config-store';
import {AppHeader} from '../../../app-header';
import CheckBox from '../../check-box';
import NotificationDetails from '../notification-details';

export default class General extends React.Component {
  constructor() {
    super();
    const storeState = ConfigStore.getState();
    this.state = {
      applicationState: storeState.applicationState,
      config: storeState.config,
      dirty: storeState.dirty
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
      dirty: storeState.dirty
    });
  }

  render() {
    return (
      <div className={`flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={classNames('fill', 'flexbox', 'row', styles.container, this.props.className)}>
          <Sidebar active="general" />
          <span className={`inline-flexbox column fill ${styles.content}`}>
            <div className={styles.stepTitle}>
              General Configuration
            </div>
            <div className={`fill flexbox row ${styles.configurationArea}`}>
              <span className={`fill`} style={{display: 'inline-block'}}>
                <Panel
                  title="Disclosure Types"
                  style={{overflow: 'visible'}}
                >
                  <DisclosureTypes
                    types={this.state.config.disclosureTypes}
                    appState={this.state.applicationState}
                  />
                </Panel>

                <Panel title="Expiration Notifications">
                  <NotificationDetails
                    dueDate={this.state.config.general.dueDate}
                    isRollingDueDate={this.state.config.general.isRollingDueDate}
                    notifications={this.state.config.notifications}
                    appState={this.state.applicationState}
                  />
                </Panel>

                <Panel title="General Configuration Options">
                  <CheckBox
                    path='config.general.instructionsExpanded'
                    label='Expand instructions by default'
                    labelClassName={styles.label}
                    checked={this.state.config.general.instructionsExpanded}
                  />
                  <CheckBox
                    path='config.general.autoApprove'
                    label='Automatically approve annual disclosures that do not have any Financial Entities'
                    labelClassName={styles.label}
                    checked={this.state.config.general.autoApprove === undefined ? false : this.state.config.general.autoApprove}
                  />
                  <CheckBox
                    path='config.general.skipFinancialEntities'
                    label='If reporter answers "No" to every "Yes/No" screening question and does not have an active Financial Entity, skip to the cerfication step.'
                    labelClassName={styles.label}
                    checked={this.state.config.general.skipFinancialEntities === undefined ? false : this.state.config.general.skipFinancialEntities}
                  />
                </Panel>
              </span>
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </span>
      </div>
    );
  }
}
