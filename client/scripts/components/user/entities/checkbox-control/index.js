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

export class CheckboxControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, evt.target.checked, this.props.questionId);
  }

  render() {
    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
        <div className={styles.invalidError}>Required Field</div>
      );
    }

    const options = this.props.options.map((option, index) => {
      let checked = {};
      if (this.props.answer instanceof Array) {
        checked = this.props.answer.includes(option);
      } else {
        checked = false;
      }

      return (
        <span className={styles.option} key={`${this.props.questionId}_${index}`}>
          <span>
            <input
              key={option}
              id={`multi_${option}`}
              value={option}
              checked={checked}
              onChange={this.onChange}
              type="checkbox"
              className={styles.radio}
            />
          </span>
          <label htmlFor={`multi_${option}`} className={styles.label}>{option}</label>
        </span>
      );
    });


    if (this.props.readonly) {
      return (
        <div className={styles.value}>
          {this.props.answer ? this.props.answer.join(', ') : ''}
        </div>
      );
    }

    return (
      <div>
        {options}
        {requiredFieldError}
      </div>
    );
  }
}
