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
import {merge} from '../../merge';
import DayPicker from 'react-day-picker';
import {formatDate} from '../../format-date';

export class DatePicker extends React.Component {
  constructor() {
    super();
    
    this.state = {
      showingCalendar: false
    };

    this.showCalendar = this.showCalendar.bind(this);
    this.dayClicked = this.dayClicked.bind(this);
  }

  showCalendar() {
    this.setState({
      showingCalendar: true
    });
  }

  dayClicked(e, day) {
    this.setState({
      showingCalendar: false
    });

    this.props.onChange(day.getTime());
  }

  render() {
    const classes = classNames(
      {[styles.showingCalendar]: this.state.showingCalendar},
      styles.container,
      this.props.className
    );

    return (
      <div className={classes}>
        <input
          readOnly={true}
          type="text"
          id={this.props.id}
          value={this.props.value ? formatDate(this.props.value) : ''}
          placeholder="Select a date"
          onFocus={this.showCalendar}
          style={merge({
            fontFamily: 'Lato',
            fontSize: 15,
            border: '1px solid #999',
            borderRadius: 5,
            padding: '3px 5px'
          }, this.props.textFieldStyle)}
        />

        <DayPicker
          className={classNames(
            styles.override,
            styles.calendar,
            {[styles.up]: this.props.direction === 'Up'}
          )}
          ref="daypicker"
          enableOutsideDays={true}
          numberOfMonths={1}
          canChangeMonth={true}
          onDayClick={this.dayClicked}
        />
      </div>
    );
  }
}
