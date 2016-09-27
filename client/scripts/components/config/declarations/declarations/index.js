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
import DeclarationType from '../declaration-type';
import DispositionType from '../disposition-type';
import ConfigActions from '../../../../actions/config-actions';
import {INSTRUCTION_STEP} from '../../../../../../coi-constants';
import ConfigPage from '../../config-page';
import NewType from '../new-type';
import CheckBox from '../../check-box';

export default class Declarations extends React.Component {
  constructor() {
    super();

    this.updateNewValue = this.updateNewValue.bind(this);
    this.createNewDeclaration = this.createNewDeclaration.bind(this);
    this.createNewDisposition = this.createNewDisposition.bind(this);
  }

  updateNewValue() {
    const textbox = this.refs.newType;
    ConfigActions.setNewDeclarationTypeText(textbox.value);
  }

  createNewDeclaration() {
    const { declarationTypes } = this.context.configState.applicationState.edits;
    if (declarationTypes !== undefined) {
      if (
        declarationTypes.description &&
        declarationTypes.description.length > 0
      ) {
        ConfigActions.saveNewTypeAndAddMore('declarationTypes');
      }
    } else {
      ConfigActions.startEditing('declarationTypes');
    }
  }

  createNewDisposition() {
    const { dispositionTypes } = this.context.configState.applicationState.edits;
    if (dispositionTypes !== undefined) {
      if (
        dispositionTypes.description &&
        dispositionTypes.description.length > 0
      ) {
        ConfigActions.saveNewTypeAndAddMore('dispositionTypes');
      }
    } else {
      ConfigActions.startEditing('dispositionTypes');
    }
  }

  render() {
    const {editorStates, config, dirty, applicationState} = this.context.configState;
    
    let declarationTypes = [];
    if (config.declarationTypes) {
      declarationTypes = config.declarationTypes.map((type, index) => {
        return (
          <DeclarationType
            index={index}
            last={index === config.declarationTypes.length - 1}
            type={type}
            key={`custom${index}`}
            applicationState={applicationState}
            active={Boolean(type.active)}
          />
        );
      });
    }

    const dispositionTypes = config.dispositionTypes.map((type, index) => {
      return (
        <DispositionType
          index={index}
          last={index === config.dispositionTypes.length - 1}
          type={type}
          key={type.typeCd}
          applicationState={applicationState}
          active={Boolean(type.active)}
        />
      );
    });

    let newDeclarationType;
    if (applicationState.edits.declarationTypes) {
      newDeclarationType = (
        <NewType
          path="applicationState.edits.declarationTypes.description"
          value={applicationState.edits.declarationTypes.description}
          type='declarationTypes'
        />
      );
    }

    let newDispositionType;
    if (applicationState.edits.dispositionTypes) {
      newDispositionType = (
        <NewType
          path="applicationState.edits.dispositionTypes.description"
          value={applicationState.edits.dispositionTypes.description}
          type='dispositionTypes'
        />
      );
    }

    let dispositionConfig;

    if (config.general.dispositionsEnabled) {
      let projectEntityRecommendationsOption;
      if (config.general.reviewerDispositionsEnabled) {
        projectEntityRecommendationsOption = (
          <div className={styles.checkbox}>
            <CheckBox
              path="config.general.reviewerEntityProjectDispositionsEnabled"
              label="Reviewers can recommend financial entity-project relationship determination"
              labelClassName={styles.label}
              checked={config.general.reviewerEntityProjectDispositionsEnabled}
            />
          </div>
        );
      }
      dispositionConfig = (
        <div>
          <div className={styles.checkbox}>
            <CheckBox
              path="config.general.adminRelationshipEnabled"
              label="Admin set financial entity-project relationship determination"
              labelClassName={styles.label}
              checked={config.general.adminRelationshipEnabled}
            />
          </div>
          <div className={styles.checkbox}>
            <CheckBox
              path="config.general.reviewerDispositionsEnabled"
              label="Reviewers can recommend a Project Disposition"
              labelClassName={styles.label}
              checked={config.general.reviewerDispositionsEnabled}
            />
          </div>
          {projectEntityRecommendationsOption}

          {dispositionTypes}
          {newDispositionType}
          <div
            className={styles.add}
            onClick={this.createNewDisposition}
          >
            + Add
            <span className={styles.another}>
              {dispositionTypes.length > 0 ? ' Another' : ' a Disposition'}
            </span>
          </div>
        </div>
      );
    }

    const dispositionPanel = (
      <Panel title="Disposition Configuration">
        <div className={styles.types}>
          <div className={styles.checkbox}>
            <CheckBox
              path="config.general.dispositionsEnabled"
              label="COI Admin can set Project Disposition"
              labelClassName={styles.label}
              checked={config.general.dispositionsEnabled}
            />
          </div>
          
          {dispositionConfig}
          <div style={{paddingBottom: 10}} />
        </div>
      </Panel>
    );

    let instructionText = '';
    if (
      config.general.instructions &&
      config.general.instructions[INSTRUCTION_STEP.PROJECT_DECLARATIONS]
    ) {
      instructionText = config.general.instructions[INSTRUCTION_STEP.PROJECT_DECLARATIONS];
    }
    return (
      <ConfigPage
        title='Customize Project Declarations'
        routeName='declarations'
        dirty={dirty}
        className={this.props.className}
      >
        <InstructionEditor
          step={INSTRUCTION_STEP.PROJECT_DECLARATIONS}
          value={instructionText}
          editorState={editorStates[INSTRUCTION_STEP.PROJECT_DECLARATIONS]}
        />
        <Panel title="Declaration Types Set by Reporter">
          <div className={styles.types}>
            {declarationTypes}
            {newDeclarationType}
            <div className={styles.add} onClick={this.createNewDeclaration}>
              + Add
              <span className={styles.another}>
                {declarationTypes.length > 0 ? ' Another' : ''}
              </span>
            </div>
          </div>

          <div style={{paddingBottom: 10}} />
        </Panel>

        {dispositionPanel}
      </ConfigPage>
    );
  }
}

Declarations.contextTypes = {
  configState: React.PropTypes.object
};
