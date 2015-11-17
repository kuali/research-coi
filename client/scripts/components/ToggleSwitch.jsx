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
import {merge} from '../merge';

export default class ToggleSwitch extends React.Component {
  constructor(props) {
    super();

    this.state = {
      on: props.defaultValue.toLowerCase() === 'on'
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    let newValue = !this.state.on;
    this.setState({
      on: newValue
    });

    if (this.props.onChange) {
      this.props.onChange(newValue ? 'On' : 'Off');
    }
  }

  render() {
    let styles = {
      container: {
        cursor: 'pointer',
        verticalAlign: 'middle',
        height: 23,
        display: 'inline-block'
      },
      base: {
        backgroundColor: window.colorBlindModeOn ? 'black' : '#999999',
        color: 'white',
        fontSize: 7,
        width: 42,
        display: 'inline-block',
        borderRadius: 9,
        padding: 4,
        position: 'relative'
      },
      label: {
        width: '50%',
        display: 'inline-block',
        textAlign: 'center'
      },
      slider: {
        position: 'absolute',
        height: 16,
        width: 16,
        backgroundColor: '#F2F2F2',
        borderRadius: 8,
        top: 0,
        left: 2,
        boxShadow: '0 0 1px 1px #AAA',
        transition: '.1s ease-out transform',
        transform: this.state.on ? 'translateX(0px)' : 'translateX(22px)'
      }
    };

    return (
      <span onClick={this.onClick} style={merge(styles.container, this.props.style)}>
        <span style={{marginRight: 8}}>
          <span style={styles.base}>
            <span style={styles.label}>OFF</span>
            <span style={styles.label}>ON</span>
            <span style={styles.slider}></span>
          </span>
        </span>
        <span style={{verticalAlign: 'middle'}}>{this.props.label}</span>
      </span>
    );
  }
}
