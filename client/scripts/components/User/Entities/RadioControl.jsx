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

export class RadioControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.questionId, this.props.isParent);
  }

  render() {
    let styles = {
      option: {
        display: 'inline-block',
        marginRight: 30,
        width: '100%'
      },
      label: {
        cursor: 'pointer'
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

    let options = this.props.options.map((option, index) => {
      return (
        <span style={styles.option} key={this.props.questionId + '_' + index}>
          <div>
            <label htmlFor={'multi_' + option + '_' + this.props.questionId} style={styles.label}>
              <input
                id={'multi_' + option + '_' + this.props.questionId}
                value={option}
                checked={this.props.answer === option}
                onChange={this.onChange}
                type="radio"
              />
              {option}
            </label>
          </div>
        </span>
      );
    });

    if (this.props.readonly) {
      return (
        <div style={styles.value}>
          {this.props.answer}
        </div>
      );
    }

    return (
      <div style={styles.container}>
        {options}
        {requiredFieldError}
      </div>
    );
  }
}
