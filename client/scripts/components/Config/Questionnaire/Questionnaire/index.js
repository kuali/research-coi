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

import React from 'react';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import ActionPanel from '../ActionPanel';
import InstructionEditor from '../InstructionEditor';
import ConfigStore from '../../../stores/ConfigStore';
import QuestionnaireConfig from '../QuestionnaireConfig';
import {COIConstants} from '../../../../../COIConstants';
import {AppHeader} from '../../AppHeader';

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
    const styles = {
      container: {
        overflowY: 'auto',
        minHeight: 0
      },
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 10,
        position: 'relative'
      },
      content: {
        backgroundColor: '#F2F2F2',
        boxShadow: '2px 8px 8px #ccc inset',
        minHeight: 0
      },
      stepTitle: {
        boxShadow: '0 2px 8px #D5D5D5',
        fontSize: 33,
        textTransform: 'uppercase',
        padding: '15px 15px 15px 35px',
        color: '#525252',
        fontWeight: 300,
        backgroundColor: 'white',
        minHeight: 70
      },
      configurationArea: {
        padding: 35,
        overflowY: 'auto',
        minHeight: 0
      }
    };

    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE];
    }

    let configSection;
    if (this.state.applicationState) {
      configSection = (
        <span className="fill" style={{display: 'inline-block'}}>
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
      <div className="flexbox column" style={{height: '100%'}}>
        <AppHeader style={styles.header} />
        <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
          <Sidebar active="questionnaire" />
          <span style={styles.content} className="inline-flexbox column fill">
            <div style={styles.stepTitle}>
              Customize Questionnaire
            </div>
            <div className="fill flexbox row" style={styles.configurationArea}>
              {configSection}
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </span>
      </div>
    );
  }
}
