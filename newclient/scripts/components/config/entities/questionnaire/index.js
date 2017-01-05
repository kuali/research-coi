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
import ActionPanel from '../../action-panel';
import InstructionEditor from '../../instruction-editor';
import QuestionnaireConfig from '../../questionnaire-config';
import {INSTRUCTION_STEP} from '../../../../../../coi-constants';
import {AppHeader} from '../../../app-header';

export default function Questionnaire(props, {configState}) {
  const {applicationState, config, editorStates, dirty} = configState;

  let instructionText = '';
  if (config.general.instructions && config.general.instructions[INSTRUCTION_STEP.FINANCIAL_ENTITIES]) {
    instructionText = config.general.instructions[INSTRUCTION_STEP.FINANCIAL_ENTITIES];
  }

  let configSection;
  if (applicationState) {
    configSection = (
      <span className={`fill ${styles.configSection}`} style={{display: 'inline-block'}}>
        <InstructionEditor
          step={INSTRUCTION_STEP.FINANCIAL_ENTITIES}
          value={instructionText}
          editorState={editorStates[INSTRUCTION_STEP.FINANCIAL_ENTITIES]}
        />
        <QuestionnaireConfig
          questionnaireCategory="entities"
          questions={config.questions.entities}
          questionsBeingEdited={applicationState.questionsBeingEdited.entities}
          newQuestion={applicationState.newQuestion.entities}
          disableSubQuestions={true}
        />
      </span>
    );
  }

  return (
    <div className={'flexbox column'} style={{minHeight: '100%'}}>
      <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
      <span className={classNames('fill', 'flexbox', 'row', styles.container, props.className)}>
        <Sidebar active="entities" />
        <span className={classNames(styles.content, 'inline-flexbox', 'column', 'fill')}>
          <div className={styles.stepTitle}>
            Financial Entities Questionnaire
          </div>
          <div className={classNames('fill', 'flexbox', 'row', styles.configurationArea)}>
            {configSection}
            <ActionPanel visible={dirty} />
          </div>
        </span>
      </span>
    </div>
  );
}

Questionnaire.contextTypes = {
  configState: React.PropTypes.object
};
