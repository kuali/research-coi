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

  getLabelStyle(invalid, validation) {
    return validation && invalid !== undefined ? {color: window.colorBlindModeOn ? 'black' : 'red'} : {};
  }

  getInputStyle(invalid, validation, style) {
    return classNames(
      style,
      {[styles.invalid]: validation && invalid !== undefined}
    );
  }

  render() {
    const {invalid, validation, label, value = ''} = this.props;
    let requiredFieldError;
    if (invalid && validation) {
      requiredFieldError = (
        <div className={styles.invalidError}>{invalid}</div>
      );
    }

    return (
      <div className={styles.container}>
        <div style={this.getLabelStyle(invalid, validation)}>{label}</div>
        <input
          type='text'
          onChange={this.onChange}
          className={this.getInputStyle(invalid, validation, styles.textBox)}
          value={value}
        />
        {requiredFieldError}
      </div>
    );
  }
}
