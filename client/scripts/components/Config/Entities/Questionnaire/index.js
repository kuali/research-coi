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
import ActionPanel from '../../ActionPanel';
import InstructionEditor from '../../InstructionEditor';
import ConfigStore from '../../../../stores/ConfigStore';
import QuestionnaireConfig from '../../QuestionnaireConfig';
import {COIConstants} from '../../../../../../COIConstants';
import {AppHeader} from '../../../AppHeader';

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
      questions: storeState.config.questions.entities,
      instructions: storeState.config.general.instructions,
      dirty: storeState.dirty
    });
  }

  render() {
    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.FINANCIAL_ENTITIES]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.FINANCIAL_ENTITIES];
    }

    let configSection;
    if (this.state.applicationState) {
      configSection = (
        <span className={`fill`} style={{display: 'inline-block'}}>
          <InstructionEditor
            step={COIConstants.INSTRUCTION_STEP.FINANCIAL_ENTITIES}
            value={instructionText}
          />
          <QuestionnaireConfig
            questionnaireCategory="entities"
            questions={this.state.questions}
            questionsBeingEdited={this.state.applicationState.questionsBeingEdited.entities}
            newQuestion={this.state.applicationState.newQuestion.entities}
            disableSubQuestions={true}
          />
        </span>
      );
    }

    return (
      <div className={`flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={classNames('fill', 'flexbox', 'row', styles.container, this.props.className)}>
          <Sidebar active="entities" />
          <span className={classNames(styles.content, 'inline-flexbox', 'column', 'fill')}>
            <div className={styles.stepTitle}>
              Financial Entities Questionnaire
            </div>
            <div className={classNames('fill', 'flexbox', 'row', styles.configurationArea)}>
              {configSection}
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </span>
      </div>
    );
  }
}
