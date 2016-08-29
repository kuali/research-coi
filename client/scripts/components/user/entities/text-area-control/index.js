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
import classNames from 'classnames';
import React from 'react';

export class TextAreaControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.questionId);
  }

  render() {
    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
        <div className={styles.invalidError}>Required Field</div>
      );
    }

    if (this.props.readonly) {
      return (
        <div className={styles.value}>
          {this.props.answer}
        </div>
      );
    }

    return (
      <div className={classNames({[styles.invalid]: this.props.invalid})}>
        <textarea
          id={`eqa${this.props.entityId}${this.props.questionId}`}
          ref="textarea"
          className={styles.textarea}
          value={this.props.answer}
          onChange={this.onChange}
        />
        {requiredFieldError}
      </div>
    );
  }
}
