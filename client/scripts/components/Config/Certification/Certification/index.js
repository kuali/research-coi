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
import Sidebar from '../../Sidebar';
import Panel from '../../Panel';
import ActionPanel from '../../ActionPanel';
import InstructionEditor from '../../InstructionEditor';
import ConfigActions from '../../../../actions/ConfigActions';
import ConfigStore from '../../../../stores/ConfigStore';
import {COIConstants} from '../../../../../../COIConstants';
import {AppHeader} from '../../../AppHeader';

export default class Certification extends React.Component {
  constructor() {
    super();

    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.textChanged = this.textChanged.bind(this);
    this.requiredChanged = this.requiredChanged.bind(this);
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

  textChanged() {
    const textarea = this.refs.textarea;
    ConfigActions.setCertificationText(textarea.value);
  }

  requiredChanged() {
    const checkbox = this.refs.checkbox;
    ConfigActions.setCertificationRequired(checkbox.checked);
  }

  render() {
    let details;
    if (this.state.certificationOptions) {
      details = (
        <div>
          <label htmlFor="certText" className={styles.textLabel}>CERTIFICATION TEXT</label>
          <textarea id="certText" ref="textarea" className={styles.textarea} value={this.state.certificationOptions.text} onChange={this.textChanged} />
          <div>
            <input type="checkbox" ref="checkbox" id="requiredagreement" checked={this.state.certificationOptions.required} onChange={this.requiredChanged} />
            <label className={styles.requireLabel} htmlFor="requiredagreement">Require checkbox agreement</label>
          </div>
        </div>
      );
    }

    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION];
    }

    return (
      <div className={`flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={classNames('fill', 'flexbox', 'row', styles.container, this.props.className)}>
          <Sidebar active="certification" />
          <span className={classNames('inline-flexbox', 'column', 'fill', styles.content)}>
            <div className={styles.stepTitle}>
              Customize Certification
            </div>
            <div className={classNames('fill', 'flexbox', 'row', styles.configurationArea)}>
              <span className={`fill`} style={{display: 'inline-block'}}>
                <InstructionEditor
                  step={COIConstants.INSTRUCTION_STEP.CERTIFICATION}
                  value={instructionText}
                />
                <Panel title="Certification">
                  <div className={styles.details}>
                    {details}
                  </div>
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
