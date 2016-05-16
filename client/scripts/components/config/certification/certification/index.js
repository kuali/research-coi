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
import {INSTRUCTION_STEP} from '../../../../../../coi-constants';
import Textarea from '../../textarea';
import CheckBox from '../../check-box';
import ConfigPage from '../../config-page';

export default function Certification(props, {configState}) {
  let details;
  const {certificationOptions} = configState.config.general;
  if (certificationOptions) {
    details = (
      <div>
        <Textarea
          path='config.general.certificationOptions.text'
          label="CERTIFICATION TEXT"
          value={certificationOptions.text}
          className={styles.textarea}
          dirty={true}
        />
        <div className={styles.requiredCheckbox}>
          <CheckBox
            path="config.general.certificationOptions.required"
            label="Require checkbox agreement"
            labelClassName={styles.requireLabel}
            checked={certificationOptions.required}
          />
        </div>
      </div>
    );
  }

  let instructionText = '';
  const {instructions} = configState.config.general;
  if (instructions && instructions[INSTRUCTION_STEP.CERTIFICATION]) {
    instructionText = instructions[INSTRUCTION_STEP.CERTIFICATION];
  }

  return (
    <ConfigPage
      title='Customize Certification'
      routeName='certification'
      dirty={configState.dirty}
      className={props.className}
    >
      <InstructionEditor
        step={INSTRUCTION_STEP.CERTIFICATION}
        value={instructionText}
        editorState={configState.editorStates[INSTRUCTION_STEP.CERTIFICATION]}
      />
      <Panel title="Certification">
        <div className={styles.details}>
          {details}
        </div>
      </Panel>
    </ConfigPage>
  );
}

Certification.contextTypes = {
  configState: React.PropTypes.object
};
