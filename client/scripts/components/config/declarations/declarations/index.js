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
import DeclarationType from '../declaration-type';
import DispositionType from '../disposition-type';
import ConfigActions from '../../../../actions/config-actions';
import {COIConstants} from '../../../../../../coi-constants';
import ConfigPage from '../../config-page';
import NewType from '../new-type';
import CheckBox from '../../check-box';

export default class Declarations extends React.Component {
  constructor() {
    super();

    this.state = {
      dispositionTypes: [],
      edits: {}
    };
    this.onChange = this.onChange.bind(this);
    this.updateNewValue = this.updateNewValue.bind(this);
    this.createNewDeclaration = this.createNewDeclaration.bind(this);
    this.createNewDisposition = this.createNewDisposition.bind(this);
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
      edits: storeState.applicationState.edits,
      editorState: storeState.editorStates[COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS],
      declarationTypes: storeState.config.declarationTypes,
      dispositionTypes: storeState.config.dispositionTypes,
      dispositionsEnabled: storeState.config.general.dispositionsEnabled,
      adminRelationshipEnabled: storeState.config.general.adminRelationshipEnabled,
      lane: storeState.config.lane,
      instructions: storeState.config.general.instructions,
      dirty: storeState.dirty
    });
  }

  updateNewValue() {
    const textbox = this.refs.newType;
    ConfigActions.setNewDeclarationTypeText(textbox.value);
  }

  createNewDeclaration() {
    ConfigActions.startEditing('declarationTypes');
  }

  createNewDisposition() {
    ConfigActions.startEditing('dispositionTypes');
  }


  render() {
    let declarationTypes;
    if (this.state.declarationTypes) {

      declarationTypes = this.state.declarationTypes.map((type, index) => {
        return (
          <DeclarationType
            index={index}
            last={index === this.state.declarationTypes.length - 1}
            type={type}
            key={`custom${index}`}
            applicationState={this.state.applicationState}
          />
        );
      });
    }

    const dispositionTypes = this.state.dispositionTypes.map((type, index) => {
      return (
        <DispositionType
          index={index}
          last={index === this.state.dispositionTypes.length - 1}
          type={type}
          key={type.typeCd}
          applicationState={this.state.applicationState}
        />
      );
    });

    let newDeclarationType;
    if (this.state.edits.declarationTypes) {
      newDeclarationType = (
        <NewType
          path="applicationState.edits.declarationTypes.description"
          value={this.state.edits.declarationTypes.value}
          type='declarationTypes'
        />
      );


    }

    let newDispositionType;
    if (this.state.edits.dispositionTypes) {
      newDispositionType = (
        <NewType
          path="applicationState.edits.dispositionTypes.description"
          value={this.state.edits.dispositionTypes.value}
          type='dispositionTypes'
        />
      );
    }

    let dispositionConfig;

    if (this.state.dispositionsEnabled) {
      dispositionConfig = (
        <div>
          <CheckBox
            path="config.general.adminRelationshipEnabled"
            label="Admin set financial entity-project relationship determination"
            labelClassName={styles.label}
            checked={this.state.adminRelationshipEnabled}
          />
          {dispositionTypes}
          {newDispositionType}
          <div className={styles.add} onClick={this.createNewDisposition}>+ Add Another</div>
        </div>
      );
    }
    let dispositionPanel;
    if(this.state.lane === COIConstants.LANES.TEST) {
      dispositionPanel = (
        <Panel title="Disposition Configuration">
          <div className={styles.types}>
            <CheckBox
              path="config.general.dispositionsEnabled"
              label="COI Admin can set Project Disposition"
              labelClassName={styles.label}
              checked={this.state.dispositionsEnabled}
            />
            {dispositionConfig}
            <div style={{paddingBottom: 10}}/>
          </div>
        </Panel>
      );
    }
    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS];
    }
    return (
      <ConfigPage
        title='Customize Project Declarations'
        routeName='declarations'
        dirty={this.state.dirty}
        className={this.props.className}
      >
        <InstructionEditor
          step={COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS}
          value={instructionText}
          editorState={this.state.editorState}
        />
        <Panel title="Declaration Types Set by Reporter">
          <div className={styles.types}>
            {declarationTypes}
            {newDeclarationType}
            <div className={styles.add} onClick={this.createNewDeclaration}>+ Add Another</div>
          </div>

          <div style={{paddingBottom: 10}}/>
        </Panel>

        {dispositionPanel}
      </ConfigPage>
    );
  }
}
