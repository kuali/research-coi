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
import InstructionEditor from '../../instruction-editor';
import ConfigStore from '../../../../stores/config-store';
import {COIConstants} from '../../../../../../coi-constants';
import Textarea from '../../textarea';
import CheckBox from '../../check-box';
import ConfigPage from '../../config-page';

export default class Certification extends React.Component {
  constructor() {
    super();

    this.state = {};

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
      certificationOptions: storeState.config.general.certificationOptions,
      instructions: storeState.config.general.instructions,
      dirty: storeState.dirty
    });
  }

  render() {
    let details;
    if (this.state.certificationOptions) {
      details = (
        <div>
          <Textarea
            path='config.general.certificationOptions.text'
            label="CERTIFICATION TEXT"
            value={this.state.certificationOptions.text}
            className={styles.textarea}
          />
          <CheckBox
            path="config.general.certificationOptions.required"
            label="Require checkbox agreement"
            labelClassName={styles.requireLabel}
            checked={this.state.certificationOptions.required}
          />
        </div>
      );
    }

    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION];
    }

    return (
      <ConfigPage
        title='Customize Certification'
        routeName='certification'
        dirty={this.state.dirty}
        className={this.props.className}
      >
        <InstructionEditor
          step={COIConstants.INSTRUCTION_STEP.CERTIFICATION}
          value={instructionText}
        />
        <Panel title="Certification">
          <div className={styles.details}>
            {details}
          </div>
        </Panel>
      </ConfigPage>
    );
  }
}
