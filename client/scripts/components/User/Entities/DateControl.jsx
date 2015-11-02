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
import {DatePicker} from '../../DatePicker';
import {formatDate} from '../../../formatDate';

export class DateControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(newDate) {
    this.props.onChange(newDate, this.props.questionId);
  }

  render() {
    let styles = {
      datepicker: {
        marginTop: 4
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
      },
      textbox: {
        padding: 6,
        fontSize: 12,
        borderRadius: 0,
        width: '80%',
        border: '1px solid #B0B0B0'
      },
      invalidError: {
        fontSize: 10,
        marginTop: 2
      }
    };

    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
      <div style={styles.invalidError}>Required Field</div>
      );
    }

    if (this.props.readonly) {
      return (
        <div style={styles.value}>
          {this.props.answer ? formatDate(this.props.answer) : ''}
        </div>
      );
    }

    return (
    <div>
      <DatePicker
        id={`eqa${this.props.questionId}`}
        textFieldStyle={styles.textbox}
        style={styles.datepicker}
        onChange={this.onChange}
        value={this.props.answer}
      />
      {requiredFieldError}
    </div>
    );
  }
}
