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

import React from 'react'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';
import DayPicker from 'react-day-picker';
import {formatDate} from '../formatDate';

export class DatePicker extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

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

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        position: 'relative'
      },
      textField: {
        fontFamily: 'Lato',
        fontSize: 15,
        border: '1px solid #999',
        borderRadius: 5,
        padding: '3px 5px'
      },
      calendar: {
        position: 'absolute',
        display: this.state.showingCalendar ? 'block' : 'none',
        border: '1px solid rgb(119, 119, 119)',
        backgroundColor: 'white',
        marginTop: 5,
        zIndex: 99
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    if (this.props.direction === 'Up') {
      styles.calendar.bottom = 30;
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <input
          readOnly={true}
          type="text"
          id={this.props.id}
          value={this.props.value ? formatDate(this.props.value) : ''}
          placeholder="Select a date"
          onFocus={this.showCalendar}
          style={merge(styles.textField, this.props.textFieldStyle)} />

        <DayPicker
          style={styles.calendar}
          ref="daypicker"
          enableOutsideDays={true}
          numberOfMonths={1}
          canChangeMonth={true}
          onDayClick={this.dayClicked} />
      </div>
    );
  }
}
