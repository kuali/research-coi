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
import CheckBox from '../../check-box';
import DueDateDetails from '../due-date-details';

export default function General(props, {configState}) {
  const generalConfig = configState.config.general;

  return (
    <ConfigPage
      title='General Configuration'
      routeName='general'
      dirty={configState.dirty}
      className={props.className}
    >
      <Panel
        title="Disclosure Types"
        style={{overflow: 'visible'}}
      >
        <DisclosureTypes
          types={configState.config.disclosureTypes}
          appState={configState.applicationState}
        />
      </Panel>

      <Panel title="Due Date">
        <DueDateDetails
          isRollingDueDate={generalConfig.isRollingDueDate}
          dueDate={generalConfig.dueDate}
        />
      </Panel>

      <Panel title="General Configuration Options">
        <div className={styles.checkbox}>
          <CheckBox
            path='config.general.instructionsExpanded'
            label='Expand instructions by default'
            labelClassName={styles.label}
            checked={generalConfig.instructionsExpanded}
          />
        </div>
        <div className={styles.checkbox}>
          <CheckBox
            path='config.general.autoApprove'
            label='Automatically approve annual disclosures that do not have any Financial Entities'
            labelClassName={styles.label}
            checked={generalConfig.autoApprove === undefined ? false : generalConfig.autoApprove}
          />
        </div>
        <div className={styles.checkbox}>
          <CheckBox
            path='config.general.autoAddAdditionalReviewer'
            label={'Automatically assign additional reviewers when disclosure is submitted, based on the reporter\'s primary unit.'}
            labelClassName={styles.label}
            checked={generalConfig.autoAddAdditionalReviewer === undefined ? false : generalConfig.autoAddAdditionalReviewer}
          />
        </div>
        <div className={styles.checkbox}>
          <CheckBox
            path='config.general.disableNewProjectStatusUpdateWhenNoEntities'
            label='Do not require researchers with no entities to update their annual disclosure when they have a new project.'
            labelClassName={styles.label}
            checked={generalConfig.disableNewProjectStatusUpdateWhenNoEntities === undefined ?
              false :
              generalConfig.disableNewProjectStatusUpdateWhenNoEntities}
          />
        </div>
      </Panel>

      <Panel title="Screening Validations">
        <div className={styles.checkbox}>
          <CheckBox
            path='config.general.skipFinancialEntities'
            label='If reporter answers "No" to every "Yes/No" screening question and does not have an active Financial Entity, skip to the certification step.' //eslint-disable-line max-len
            labelClassName={styles.label}
            checked={generalConfig.skipFinancialEntities === undefined ? false : generalConfig.skipFinancialEntities}
          />
        </div>
        <div className={styles.checkbox}>
          <CheckBox
            path='config.general.enforceFinancialEntities'
            label='Enforce that a "Yes" answer to any screening question will require the reporter to include an active financial entity in their disclosure.' //eslint-disable-line max-len
            labelClassName={styles.label}
            checked={generalConfig.enforceFinancialEntities === undefined ? false : generalConfig.enforceFinancialEntities}
          />
        </div>
      </Panel>
    </ConfigPage>
  );
}

General.contextTypes = {
  configState: React.PropTypes.object
};
