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
import Notification from './Notification';
import DueDateDetails from './DueDateDetails';

export default class NotificationDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      adding: true,
      canBeAdded: false
    };

    this.textChanged = this.textChanged.bind(this);
    this.done = this.done.bind(this);
    this.add = this.add.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  cancel() {
    this.setState({
      adding: false
    });
    ConfigActions.setReminderTextOnNotification(undefined, '');
  }

  add() {
    if (this.state.adding) {
      ConfigActions.saveNewNotification();
      this.setState({
        canBeAdded: false
      });
    }
    else {
      this.setState({
        adding: true
      });
    }
  }

  done() {
    this.add();
    this.setState({
      adding: false
    });
  }

  textChanged() {
    const textarea = this.refs.reminderText;
    this.setState({
      canBeAdded: textarea.value.length > 0
    });
    ConfigActions.setReminderTextOnNotification(undefined, textarea.value);
  }

  render() {
    const styles = {
      container: {
        padding: '10px 0',
        maxWidth: 646,
        margin: '0 auto'
      },
      dateDetailSection: {
        borderTop: '1px solid #aaa',
        marginTop: 20,
        paddingTop: 20
      },
      done: {
        float: 'right',
        cursor: 'pointer'
      },
      buttons: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        marginTop: 20,
        fontSize: 17,
        height: 21
      },
      add: {
        cursor: 'pointer'
      },
      cancel: {
        float: 'right',
        color: window.colorBlindModeOn ? 'black' : '#F57C00',
        paddingLeft: 5,
        marginLeft: 25,
        paddingTop: 7,
        paddingBottom: 2,
        fontSize: 8,
        borderBottom: window.colorBlindModeOn ? '1px dotted black' : '1px dotted #F57C00',
        cursor: 'pointer',
        verticalAlign: 'middle'
      },
      expirationMessage: {
        display: 'block',
        width: '100%',
        padding: 10,
        fontSize: 16,
        marginTop: 10,
        borderRadius: 5,
        border: '1px solid #AAA'
      }
    };

    let notifications;
    if (this.props.notifications && this.props.notifications.length > 0) {
      notifications = this.props.notifications.map((notification, index) => {
        return (
          <Notification
            key={index}
            id={notification.id}
            warningValue={notification.warningValue}
            warningPeriod={notification.warningPeriod}
            reminderText={notification.reminderText}
          />
        );
      });
    }

    let doneButton;
    let addButton;
    if (this.state.canBeAdded) {
      doneButton = (
        <span style={styles.done} onClick={this.done}>Done</span>
      );
    }

    if (this.state.canBeAdded || !this.state.adding) {
      addButton = (
        <span style={styles.add} onClick={this.add}>+ Add Another</span>
      );
    }

    let newNotification;
    if (this.props.appState && this.state.adding) {
      newNotification = (
        <div>
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
              onChange={this.textChanged}
              style={styles.expirationMessage}
              placeholder="Enter the reminder text here"
              value={this.props.appState.newNotification.reminderText}
              aria-label="Notification text"
            >
            </textarea>
          </div>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <DueDateDetails
          isRollingDueDate={this.props.isRollingDueDate}
          dueDate={this.props.dueDate}
        />

        <div style={styles.dateDetailSection}>
          {notifications}

          {newNotification}

          <div style={styles.buttons}>
            {doneButton}
            {addButton}
          </div>
        </div>
      </div>
    );
  }
}
