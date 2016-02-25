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
    return (
      <div style={this.props.styles.container}>
        <label
          htmlFor={this.props.id}
          style={this.getLabelStyle(this.props.invalid, this.props.styles.label)}
        >
          {this.props.label}
        </label>
        <input
          id={this.props.id}
          type='text'
          onChange={this.onChange}
          name={this.props.name}
          style={this.getInputStyle(this.props.invalid, this.props.styles.input)}
          value={this.props.value}
        />
      </div>
    );
  }
}
