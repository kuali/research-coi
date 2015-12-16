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

export class NumericControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.questionId);
  }

  render() {
    const styles = {
      container: {
        width: '100%',
        display: 'inline-block'
      },
      textbox: {
        padding: 6,
        width: '80%',
        border: '1px solid #B0B0B0'
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
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
          {this.props.answer}
        </div>
      );
    }

    return (
    <div>
      <div style={styles.container}>
        <input style={styles.textbox} type="number" id={`eqa${this.props.questionId}`} onChange={this.onChange} value={this.props.answer} />
      </div>
      {requiredFieldError}
    </div>
    );
  }
}
