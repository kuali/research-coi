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
import TextField from '../text-field';
import {merge} from '../../../merge';

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
    if ( !regex.test(key) ) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  render() {
    const {id, invalid, value = '', styles: style, label} = this.props;
    const inputStyle = merge(style.input, {padding: '2px 20px'});

    return (
      <div style={style.container}>
        <label
          htmlFor={id}
          style={this.getLabelStyle(invalid, style.label)}
        >
          {label}
        </label>
        <div style={{position: 'relative'}}>
          <span className={styles.currency}>$</span>
          <input
            id={id}
            type='text'
            onChange={this.onChange}
            name={name}
            style={this.getInputStyle(invalid, inputStyle)}
            value={value}
            onKeyPress={this.validateNumeric}
          />
        </div>
      </div>
    );
  }
}
