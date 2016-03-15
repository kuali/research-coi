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
import ConfigPage from '../../config-page';
import Panel from '../../panel';
import DisclosureTypes from '../disclosure-types';
import ConfigStore from '../../../../stores/config-store';
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
      <ConfigPage
        title='General Configuration'
        routeName='general'
        dirty={this.state.dirty}
        className={this.props.className}
      >
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
        </Panel>

        <Panel title="Screening Validations">
          <CheckBox
            path='config.general.skipFinancialEntities'
            label='If reporter answers "No" to every "Yes/No" screening question and does not have an active Financial Entity, skip to the certification step.' //eslint-disable-line max-len
            labelClassName={styles.label}
            checked={this.state.config.general.skipFinancialEntities === undefined ? false : this.state.config.general.skipFinancialEntities}
          />
          <CheckBox
            path='config.general.enforceFinancialEntities'
            label='Enforce that a "Yes" answer to any screening question will require the reporter to include an active financial entity in their disclosure.' //eslint-disable-line max-len
            labelClassName={styles.label}
            checked={this.state.config.general.enforceFinancialEntities === undefined ? false : this.state.config.general.enforceFinancialEntities}
          />
        </Panel>
      </ConfigPage>
    );
  }
}
