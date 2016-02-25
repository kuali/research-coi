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
import classNames from 'classnames';
import React from 'react';
import Sidebar from '../../sidebar';
import Panel from '../../panel';
import ActionPanel from '../../action-panel';
import InstructionEditor from '../../instruction-editor';
import ConfigStore from '../../../../stores/config-store';
import DeclarationType from '../declaration-type';
import DoneLink from '../../done-link';
import ConfigActions from '../../../../actions/config-actions';
import {COIConstants} from '../../../../../../coi-constants';
import {AppHeader} from '../../../app-header';

export default class Declarations extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.lookForEnter = this.lookForEnter.bind(this);
    this.updateNewValue = this.updateNewValue.bind(this);
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
      declarationTypes: storeState.config.declarationTypes,
      instructions: storeState.config.general.instructions,
      dirty: storeState.dirty
    });
  }

  lookForEnter(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      ConfigActions.saveNewDeclarationType();
    }
  }

  updateNewValue() {
    const textbox = this.refs.newType;
    ConfigActions.setNewDeclarationTypeText(textbox.value);
  }

  render() {
    let typesJsx;
    let customTypes;
    if (this.state.declarationTypes) {
      typesJsx = this.state.declarationTypes.filter(type => {
        return !type.custom;
      }).map(type => {
        return (
          <DeclarationType
            type={type}
            key={type.typeCd}
            applicationState={this.state.applicationState}
            toggle={true}
          />
        );
      });

      customTypes = this.state.declarationTypes.filter(type => {
        return type.custom;
      }).map((type, index) => {
        return (
          <DeclarationType
            type={type}
            key={`custom${index}`}
            applicationState={this.state.applicationState}
            delete={true}
            toggle={false}
          />
        );
      });
    }

    let newType;
    if (this.state.applicationState && this.state.applicationState.enteringNewType) {
      newType = (
        <div style={{margin: '0 20px 0 10px'}}>
          <input
            type="text"
            ref="newType"
            value={this.state.applicationState.newTypeText}
            className={styles.textbox}
            onKeyUp={this.lookForEnter}
            onChange={this.updateNewValue}
          />
          <DoneLink
            className={`${styles.override} ${styles.editLink}`}
            onClick={ConfigActions.saveNewDeclarationType}
          />
        </div>
      );

      requestAnimationFrame(() => {
        this.refs.newType.focus();
      });
    }

    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS];
    }

    return (
      <div className={`flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <div className={classNames('fill', 'flexbox', 'row', styles.container, this.props.className)}>
          <Sidebar active="declarations" />
          <span className={classNames(styles.content, 'inline-flexbox', 'column', 'fill')}>
            <div className={styles.stepTitle}>
              Customize Project Declarations
            </div>
            <div className={classNames('fill', 'flexbox', 'row', styles.configurationArea)}>
              <span className={`fill`} style={{display: 'inline-block'}}>
                <InstructionEditor
                  step={COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS}
                  value={instructionText}
                />
                <Panel title="Declaration Types">
                  <div className={styles.types}>
                    {typesJsx}

                    {customTypes}
                    {newType}
                    <div className={styles.add} onClick={ConfigActions.startEnteringNewDeclarationType}>+ Add Another</div>
                  </div>

                  <div style={{paddingBottom: 10}}>
                  </div>
                </Panel>
              </span>
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </div>
      </div>
    );
  }
}
