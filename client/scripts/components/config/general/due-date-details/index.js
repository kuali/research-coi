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
import {DatePicker} from '../../../date-picker';
import ConfigActions from '../../../../actions/config-actions';

export default class DueDateDetails extends React.Component {
  constructor() {
    super();

    this.setDueDate = this.setDueDate.bind(this);
    this.makeRolling = this.makeRolling.bind(this);
    this.makeStatic = this.makeStatic.bind(this);
  }

  makeRolling() {
    const rollingRadio = this.refs.rolling;
    if (rollingRadio.checked) {
      ConfigActions.setIsRollingDueDate(true);
    }
  }

  makeStatic() {
    const staticRadio = this.refs.static;
    if (staticRadio.checked) {
      ConfigActions.setIsRollingDueDate(false);
    }
  }

  setDueDate(newDate) {
    ConfigActions.setDueDate(newDate);
  }

  render() {
    let dueDate;
    if (this.props.isRollingDueDate === false) {
      dueDate = (
        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <div>
            <DatePicker
              id="dueDate"
              className={`${styles.override} ${styles.datepicker}`}
              onChange={this.setDueDate}
              value={this.props.dueDate}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={classNames(styles.container, this.props.className)}>
        <div className={styles.notificationQuestion}>How are your institution's due dates set up?</div>
        <div className={classNames('flexbox', 'row', styles.dueDateOptions)}>
          <span className={styles.dueDataType}>
            <input
              type="radio"
              name="duedatetype"
              id="static"
              ref="static"
              onChange={this.makeStatic}
              className={styles.checkbox}
              checked={this.props.isRollingDueDate === false}
            />
            <label htmlFor="static" style={{marginRight: 50}}>Static Annual Due Date</label>
          </span>
          <span className={styles.dueDataType}>
            <input
              type="radio"
              name="duedatetype"
              id="rolling"
              ref="rolling"
              onChange={this.makeRolling}
              className={styles.checkbox}
              checked={this.props.isRollingDueDate}
            />
            <label htmlFor="rolling">Rolling Annual Due Date</label>
          </span>
        </div>

        {dueDate}
      </div>
    );
  }
}
