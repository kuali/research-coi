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

import React from 'react'; //eslint-disable-line no-unused-vars
import TextField from './TextField';
import {merge} from '../../merge';

export default class NumericField extends TextField {
  constructor() {
    super();

    this.validateNumeric = this.validateNumeric.bind(this);
  }

  validateNumeric(e) {
    const event = e || window.event;
    let key = event.keyCode || event.which;
    key = String.fromCharCode( key );
    const regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      event.returnValue = false;
      if(event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  render() {
    const styles = {
      currency: {
        position: 'absolute',
        display: 'inline',
        float: 'left',
        color: 'grey',
        left: 6,
        top: 4
      }
    };

    const inputStyle = merge(this.props.styles.input, {padding: '2px 20px'});

    return (
      <div style={this.props.styles.container}>
        <label htmlFor={this.props.id} style={this.getLabelStyle(this.props.invalid, this.props.styles.label)}>
          {this.props.label}
        </label>
        <div style={{position: 'relative'}}>
          <span style={styles.currency}>$</span>
          <input
            id={this.props.id}
            type='text'
            onChange={this.onChange}
            name={this.props.name}
            style={this.getInputStyle(this.props.invalid, inputStyle)}
            value={this.props.value}
            onKeyPress={this.validateNumeric}
          />
        </div>
      </div>
    );
  }
}
