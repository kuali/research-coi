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

import React from 'react';
import {DatePicker} from '../../DatePicker';
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';

export default class DueDateDetails extends React.Component {
  constructor() {
    super();

    this.setDueDate = this.setDueDate.bind(this);
    this.makeRolling = this.makeRolling.bind(this);
    this.makeStatic = this.makeStatic.bind(this);
  }

  makeRolling() {
    let rollingRadio = this.refs.rolling;
    if (rollingRadio.checked) {
      ConfigActions.setIsRollingDueDate(true);
    }
  }

  makeStatic() {
    let staticRadio = this.refs.static;
    if (staticRadio.checked) {
      ConfigActions.setIsRollingDueDate(false);
    }
  }

  setDueDate(newDate) {
    ConfigActions.setDueDate(newDate);
  }

  render() {
    let styles = {
      container: {
        margin: '0 23px 15px 23px'
      },
      notificationQuestion: {
        fontWeight: 'bold',
        margin: '5px 0 17px 0',
        textAlign: 'center'
      },
      dueDateOptions: {
        paddingBottom: 15
      },
      dueDataType: {
        flex: 1,
        fontSize: 17
      },
      checkbox: {
        marginRight: 10
      },
      datepicker: {
        marginTop: 4
      },
      title: {
        fontSize: 12,
        marginBottom: 10
      }
    };

    let dueDate;
    if (this.props.isRollingDueDate === false) {
      dueDate = (
        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <div>
            <DatePicker id="dueDate" style={styles.datepicker} onChange={this.setDueDate} value={this.props.dueDate} />
          </div>
        </div>
      );
    }

    let heading;
    if (this.props.showTitleQuestion) {
      heading = (
        <div style={styles.notificationQuestion}>How are your institution's due dates set up?</div>
      );
    }
    else {
      heading = (
        <div style={styles.title}>DISCLOSURE DUE DATES</div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        {heading}
        <div className="flexbox row" style={styles.dueDateOptions}>
          <span style={styles.dueDataType}>
            <input
              type="radio"
              name="duedatetype"
              id="static"
              ref="static"
              onChange={this.makeStatic}
              style={styles.checkbox}
              checked={this.props.isRollingDueDate === false}
            />
            <label htmlFor="static" style={{marginRight: 50}}>Static Annual Due Date</label>
          </span>
          <span style={styles.dueDataType}>
            <input
              type="radio"
              name="duedatetype"
              id="rolling"
              ref="rolling"
              onChange={this.makeRolling}
              style={styles.checkbox}
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
