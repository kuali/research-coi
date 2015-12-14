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
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';
import DateOptions from './DateOptions';

export default class NewNotifications extends React.Component {
  constructor() {
    super();

    this.setReminderText = this.setReminderText.bind(this);
  }

  setReminderText() {
    const reminderTextbox = this.refs.reminderText;
    ConfigActions.setReminderTextOnNotification(undefined, reminderTextbox.value);
  }

  render() {
    const styles = {
      container: {
      },
      edit: {
        float: 'right'
      },
      expirationMessage: {
        display: 'block',
        width: '100%',
        padding: 10,
        fontSize: 16,
        marginTop: 10,
        borderRadius: 5
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div>
          <DateOptions
            warningValue={this.props.warningValue}
            warningPeriod={this.props.warningPeriod}
            id={this.props.id}
          />

          <span style={styles.cancel} onClick={this.cancel}>
            X CANCEL
          </span>
        </div>
        <textarea
          ref="reminderText"
          onChange={this.setReminderText}
          style={styles.expirationMessage}
          placeholder="Enter the reminder text here"
          value={this.props.reminderText}>
        </textarea>
      </div>
    );
  }
}
