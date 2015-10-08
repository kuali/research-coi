import React from 'react/addons'; //eslint-disable-line no-unused-vars
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
