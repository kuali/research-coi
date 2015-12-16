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
import {merge} from '../../merge';
import {DatePicker} from '../DatePicker';

export default class TextField extends React.Component {
  constructor() {
    super();

    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.getInputStyle = this.getInputStyle.bind(this);
    this.getLabelStyle = this.getLabelStyle.bind(this);
  }

  onStartDateChange(evt) {
    this.props.onStartDateChange(evt);
  }

  onEndDateChange(evt) {
    this.props.onEndDateChange(evt);
  }

  getLabelStyle(invalid, style) {
    return invalid === true ? merge({color: window.colorBlindModeOn ? 'black' : 'red'}) : style;
  }

  getInputStyle(invalid, style) {
    return invalid === true ? merge(style, {borderBottom: '3px solid red'}) : style;
  }

  render() {
    const styles = {
      date: {
        width: 120,
        display: 'inline-block'
      },
      dateMiddle: {
        marginRight: 8
      }
    };

    const invalid = this.props.startDateInvalid || this.props.endDateInvalid;

    return (
      <div style={this.props.styles.container}>
        <label htmlFor={this.props.id} style={this.getLabelStyle(invalid, this.props.styles.label)}>{this.props.label}</label>
        <div id={this.props.id} style={{width: '98%'}}>
          <DatePicker
            id="startDate"
            onChange={this.onStartDateChange}
            value={this.props.startDate}
            style={styles.date}
            textFieldStyle={this.getInputStyle(this.props.startDateInvalid, this.props.styles.input)}
          />
          <span style={styles.dateMiddle}>TO</span>
          <DatePicker
            id="endDate"
            onChange={this.onEndDateChange}
            value={this.props.endDate}
            style={styles.date}
            textFieldStyle={this.getInputStyle(this.props.endDateInvalid, this.props.styles.input)}
          />
        </div>
      </div>
    );
  }
}
