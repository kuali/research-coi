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
import ConfigActions from '../../../../actions/config-actions';

export default class DateOptions extends React.Component {
  constructor() {
    super();

    this.setValue = this.setValue.bind(this);
    this.setPeriod = this.setPeriod.bind(this);
  }

  setValue(evt) {
    ConfigActions.set({
      dirty: false,
      path: `${this.props.path}.value`,
      value: evt.target.value
    });
  }

  setPeriod(evt) {
    ConfigActions.set({
      dirty: false,
      path: `${this.props.path}.period`,
      value: evt.target.value
    });
  }

  render() {
    const warningValue = [];
    let i = 1;
    while (i <= 31) {
      warningValue.push(
        <option key={i} value={i}>{i}</option>
      );
      i++;
    }

    let value;
    let period;
    if (this.props.readOnly) {
      value = (
        <span className={styles.value}>{this.props.value}</span>
      );
      period = (
        <span className={styles.period}>{this.props.period}</span>
      );
    } else {
      value = (
        <select value={this.props.value} className={styles.warningValue} onChange={this.setValue}>
          {warningValue}
        </select>
      );
      period = (
        <select value={this.props.period} className={styles.warningPeriod} onChange={this.setPeriod}>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      );
    }
    return (
      <span className={classNames(styles.container, this.props.className)}>
        <span className={styles.send}>Send</span>
        {value}
        {period}
        <span className={styles.before}>before expiration</span>
      </span>
    );
  }
}
