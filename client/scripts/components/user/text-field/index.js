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

import React from 'react';
import {merge} from '../../../merge';

export default class TextField extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.getInputStyle = this.getInputStyle.bind(this);
    this.getLabelStyle = this.getLabelStyle.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt);
  }

  getLabelStyle(invalid, style) {
    return invalid === true
           ? merge({color: window.colorBlindModeOn ? 'black' : 'red'})
           : style;
  }

  getInputStyle(invalid, style) {
    return invalid === true
           ? merge(style, {borderBottom: '3px solid red'})
           : style;
  }

  render() {
    const {styles, id, invalid, label, value = ''} = this.props;

    return (
      <div style={styles.container}>
        <label
          htmlFor={id}
          style={this.getLabelStyle(invalid, styles.label)}
        >
          {label}
        </label>
        <input
          id={id}
          type='text'
          onChange={this.onChange}
          name={name}
          style={this.getInputStyle(invalid, styles.input)}
          value={value}
        />
      </div>
    );
  }
}
