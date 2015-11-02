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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';

export default class RelationshipTextField extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.getInputStyle = this.getInputStyle.bind(this);
    this.getLabelStyle = this.getLabelStyle.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value);
  }

  getLabelStyle(invalid) {
    return invalid === true ? {color: window.colorBlindModeOn ? 'black' : 'red'} : {};
  }

  getInputStyle(invalid, style) {
    return invalid === true ? merge(style, {borderBottom: '3px solid red'}) : style;
  }

  render() {
    let styles = {
      container: {
        marginBottom: 16,
        textAlign: 'left',
        display: 'block'
      },
      textBox: {
        padding: 6,
        width: '100%',
        borderRadius: 0,
        fontSize: 16,
        border: '1px solid #B0B0B0'
      }
    };

    return (
      <div style={styles.container}>
        <div style={this.getLabelStyle(this.props.invalid)}>{this.props.label}</div>
        <input type='text' onChange={this.onChange} style={this.getInputStyle(this.props.invalid, styles.textBox)}
               value={this.props.value}/>
      </div>
    );
  }
}
