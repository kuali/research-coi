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
import ConfigStore from '../../../stores/ConfigStore';
import DeclarationType from './DeclarationType';
import DeleteLink from '../DeleteLink';
import DoneLink from '../DoneLink';
import ConfigActions from '../../../actions/ConfigActions';
import {COIConstants} from '../../../../../COIConstants';
import {AppHeader} from '../../AppHeader';

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
    let storeState = ConfigStore.getState();
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
    let textbox = this.refs.newType;
    ConfigActions.setNewDeclarationTypeText(textbox.value);
  }

  render() {
    let styles = {
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
      types: {
        width: 350
      },
      add: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        margin: '0 0 0 20px',
        padding: 10,
        fontSize: 17,
        cursor: 'pointer'
      },
      textbox: {
        verticalAlign: 'middle',
        marginLeft: 10,
        padding: 3,
        fontSize: 16
      },
      editLink: {
        paddingTop: 2,
        marginLeft: 3
      }
    };

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
          <input type="text" ref="newType" value={this.state.applicationState.newTypeText} style={styles.textbox} onKeyUp={this.lookForEnter} onChange={this.updateNewValue} />
          <DoneLink style={styles.editLink} onClick={ConfigActions.saveNewDeclarationType} />
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
      <div className="flexbox column" style={{height: '100%'}}>
        <AppHeader style={styles.header} />
        <div className="fill flexbox row" style={merge(styles.container, this.props.style)}>
          <Sidebar active="declarations" />
          <span style={styles.content} className="inline-flexbox column fill">
            <div style={styles.stepTitle}>
              Customize Project Declarations
            </div>
            <div className="fill flexbox row" style={styles.configurationArea}>
              <span className="fill" style={{display: 'inline-block'}}>
                <InstructionEditor
                  step={COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS}
                  value={instructionText}
                />
                <Panel title="Declaration Types">
                  <div style={styles.types}>
                    {typesJsx}

                    {customTypes}
                    {newType}
                    <div style={styles.add} onClick={ConfigActions.startEnteringNewDeclarationType}>+ Add Another</div>
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
