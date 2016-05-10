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
  const {config, editorStates, applicationState, dirty} = configState;
  let instructionText = '';
  if (config.general.instructions && config.general.instructions[INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE]) {
    instructionText = config.general.instructions[INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE];
  }

  let configSection;
  if (applicationState) {
    configSection = (
      <span className={`fill`} style={{display: 'inline-block'}}>
        <InstructionEditor
          step={INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE}
          value={instructionText}
          editorState={editorStates[INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE]}
        />
        <QuestionnaireConfig
          questionnaireCategory="screening"
          questions={config.questions.screening}
          questionsBeingEdited={applicationState.questionsBeingEdited.screening}
          newQuestion={applicationState.newQuestion.screening}
        />
      </span>
    );
  }

  return (
    <div className={`flexbox column`} style={{minHeight: '100%'}}>
      <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
      <span className={classNames('fill', 'flexbox', 'row', styles.container, props.className)}>
        <Sidebar active="questionnaire" />
        <span className={`inline-flexbox column fill ${styles.content}`}>
          <div className={styles.stepTitle}>
            Customize Questionnaire
          </div>
          <div className={`fill flexbox row ${styles.configurationArea}`}>
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
