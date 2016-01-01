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
import Panel from '../Panel';
import ActionPanel from '../ActionPanel';
import InstructionEditor from '../InstructionEditor';
import ConfigActions from '../../../actions/ConfigActions';
import ConfigStore from '../../../stores/ConfigStore';
import {COIConstants} from '../../../../../COIConstants';
import {AppHeader} from '../../AppHeader';

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
    const styles = {
      container: {
        minHeight: 100
      },
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 10,
        position: 'relative'
      },
      content: {
        backgroundColor: '#F2F2F2',
        boxShadow: '2px 8px 8px #ccc inset'
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
      },
      textarea: {
        width: '100%',
        height: 160,
        padding: 10,
        fontSize: 16,
        margin: '2px 0 30px 0',
        borderRadius: 5,
        border: '1px solid #AAA'
      },
      details: {
        padding: '3px 15px 12px 15px'
      },
      requireLabel: {
        paddingLeft: 8,
        fontSize: 14
      },
      textLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        paddingBottom: 2
      }
    };

    let details;
    if (this.state.certificationOptions) {
      details = (
        <div>
          <label htmlFor="certText" style={styles.textLabel}>CERTIFICATION TEXT</label>
          <textarea id="certText" ref="textarea" style={styles.textarea} value={this.state.certificationOptions.text} onChange={this.textChanged} />
          <div>
            <input type="checkbox" ref="checkbox" id="requiredagreement" checked={this.state.certificationOptions.required} onChange={this.requiredChanged} />
            <label style={styles.requireLabel} htmlFor="requiredagreement">Require checkbox agreement</label>
          </div>
        </div>
      );
    }

    let instructionText = '';
    if (this.state.instructions && this.state.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION]) {
      instructionText = this.state.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION];
    }

    return (
      <div className="flexbox column" style={{height: '100%'}}>
        <AppHeader style={styles.header} />
        <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
          <Sidebar active="certification" />
          <span style={styles.content} className="inline-flexbox column fill">
            <div style={styles.stepTitle}>
              Customize Certification
            </div>
            <div className="fill flexbox row" style={styles.configurationArea}>
              <span className="fill" style={{display: 'inline-block'}}>
                <InstructionEditor
                  step={COIConstants.INSTRUCTION_STEP.CERTIFICATION}
                  value={instructionText}
                />
                <Panel title="Certification">
                  <div style={styles.details}>
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
