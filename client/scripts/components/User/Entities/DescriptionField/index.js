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

import styles from './style';
import classNames from 'classnames';
import React from 'react';

export class DescriptionField extends React.Component {
  constructor() {
    super();

    this.setDescription = this.setDescription.bind(this);
  }

  setDescription() {
    this.props.onChange(this.refs.description.value);
  }

  render() {
    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
        <div className={styles.invalidError}>Required Field</div>
      );
    }

    let dom;
    if (this.props.readonly) {
      dom = (
        <div className={styles.value}>{this.props.value}</div>
      );
    }
    else {
      dom = (
        <textarea
          required
          ref="description"
          onChange={this.setDescription}
          className={styles.description}
          value={this.props.value}
        />
      );
    }

    const classes = classNames(
      {[styles.invalid]: this.props.invalid},
      styles.container,
      this.props.className
    );

    return (
      <span className={classes}>
        <div style={{fontSize: 13}}>Describe the entity's area of business and your relationship to it:</div>
        <div>
          {dom}
        </div>
        {requiredFieldError}
      </span>
    );
  }
}
