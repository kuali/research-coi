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
import ConfigActions from '../../../../actions/ConfigActions';

export default class DateOptions extends React.Component {
  constructor() {
    super();

    this.setWarningValue = this.setWarningValue.bind(this);
    this.setWarningPeriod = this.setWarningPeriod.bind(this);
  }

  setWarningValue() {
    const warningValueSelect = this.refs.warningValue;
    ConfigActions.setWarningValueOnNotification(this.props.id, warningValueSelect.value);
  }

  setWarningPeriod() {
    const warningPeriodSelect = this.refs.warningPeriod;
    ConfigActions.setWarningPeriodOnNotification(this.props.id, warningPeriodSelect.value);
  }

  render() {
    const warningValue = [];
    let i = 1;
    while (i <= 31) {
      warningValue.push(
        <option key={i}>{i}</option>
      );
      i++;
    }

    return (
      <span className={classNames(styles.container, this.props.className)}>
        <span className={styles.send}>Send</span>
        <select ref="warningValue" value={this.props.warningValue} className={styles.warningValue} onChange={this.setWarningValue}>
          {warningValue}
        </select>
        <select ref="warningPeriod" value={this.props.warningPeriod} className={styles.warningPeriod} onChange={this.setWarningPeriod}>
          <option>Days</option>
          <option>Weeks</option>
          <option>Months</option>
        </select>
        <span className={styles.before}>before expiration</span>
      </span>
    );
  }
}
