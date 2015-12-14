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
import {merge} from '../../merge';
import ConfigActions from '../../actions/ConfigActions';

export default class InstructionEditor extends React.Component {
  constructor(props) {
    super();

    this.state = {
      open: props.value && props.value.length > 0
    };

    this.toggle = this.toggle.bind(this);
    this.textChanged = this.textChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.value && nextProps.value.length > 0
    });
  }

  textChanged() {
    const textarea = this.refs.textarea;
    ConfigActions.setInstructions(this.props.step, textarea.value);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const styles = {
      container: {
        backgroundColor: 'white',
        marginBottom: 20,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: '0 0 10px #BBB'
      },
      flipper: {
        position: 'absolute',
        right: 22,
        transform: this.state.open ? 'rotateZ(-180deg)' : 'rotateZ(0deg) translateY(-3px)',
        transition: 'transform .2s linear',
        fontSize: 25
      },
      top: {
        padding: '10px 20px',
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: 18,
        color: 'black',
        borderRadius: '5px 5px 0 0'
      },
      bottom: {
        borderTop: '1px solid #AAA',
        padding: '15px 27px 21px 27px',
        zIndex: 1,
        position: 'relative',
        marginTop: this.state.open ? 0 : -146,
        transition: 'margin-top .2s ease-out'
      },
      textarea: {
        width: '100%',
        height: 85,
        fontSize: 16,
        padding: 10,
        borderRadius: 5,
        border: '1px solid #AAA'
      },
      label: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingBottom: 2,
        color: '#555',
        display: 'block'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.top} onClick={this.toggle}>
          {this.props.step}
          <span style={{marginLeft: 3}}>Instructions</span>
          <span style={styles.flipper}>
            <i className="fa fa-caret-down"></i>
          </span>
        </div>
        <div style={{overflow: 'hidden'}}>
          <div style={styles.bottom}>
            <label htmlFor="instructionText" style={styles.label}>INSTRUCTION TEXT</label>
            <div>
              <textarea
                id="instructionText"
                style={styles.textarea}
                placeholder="Type instructions here"
                onChange={this.textChanged}
                ref="textarea"
                value={this.props.value}
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
