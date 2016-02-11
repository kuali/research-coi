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
import ActionPanel from '../../action-panel';
import InstructionEditor from '../../instruction-editor';
import ConfigStore from '../../../../stores/config-store';
import QuestionnaireConfig from '../../questionnaire-config';
import {COIConstants} from '../../../../../../coi-constants';
import {AppHeader} from '../../../app-header';

export default class Questionnaire extends React.Component {
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
      applicationState: storeState.applicationState,
      questions: storeState.config.questions.screening,
      instructions: storeState.config.general.instructions,
      dirty: storeState.dirty
    });
  }

  render() {
    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE];
    }

    let configSection;
    if (this.state.applicationState) {
      configSection = (
        <span className={`fill`} style={{display: 'inline-block'}}>
          <InstructionEditor
            step={COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE}
            value={instructionText}
          />
          <QuestionnaireConfig
            questionnaireCategory="screening"
            questions={this.state.questions}
            questionsBeingEdited={this.state.applicationState.questionsBeingEdited.screening}
            newQuestion={this.state.applicationState.newQuestion.screening}
          />
        </span>
      );
    }

    return (
      <div className={`flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={classNames('fill', 'flexbox', 'row', styles.container, this.props.className)}>
          <Sidebar active="questionnaire" />
          <span className={`inline-flexbox column fill ${styles.content}`}>
            <div className={styles.stepTitle}>
              Customize Questionnaire
            </div>
            <div className={`fill flexbox row ${styles.configurationArea}`}>
              {configSection}
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </span>
      </div>
    );
  }
}
