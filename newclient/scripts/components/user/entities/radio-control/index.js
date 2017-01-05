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

let renderId = 0;

function getUniqueIdForControl() {
  renderId++;
  return renderId;
}

export class RadioControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.questionId, this.props.isParent);
  }

  render() {
    const controlId = getUniqueIdForControl();

    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
        <div className={styles.invalidError}>Required Field</div>
      );
    }

    const options = this.props.options.map((option, index) => {
      return (
        <span className={styles.option} key={`${this.props.questionId}_${index}`}>
          <div>
            <label htmlFor={`${controlId}multi_${option}_${this.props.questionId}`} className={styles.label}>
              <input
                id={`${controlId}multi_${option}_${this.props.questionId}`}
                value={option}
                checked={this.props.answer === option}
                onChange={this.onChange}
                type="radio"
              />
              <span style={{marginLeft: 3}}>
                {option}
              </span>
            </label>
          </div>
        </span>
      );
    });

    if (this.props.readonly) {
      return (
        <div className={styles.value}>
          {this.props.answer}
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {options}
        {requiredFieldError}
      </div>
    );
  }
}
