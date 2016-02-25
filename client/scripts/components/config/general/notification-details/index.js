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
/*eslint  no-unused-vars:0 */
import styles from './style';
import classNames from 'classnames';
import React from 'react';
import ConfigActions from '../../../../actions/config-actions';
import DateOptions from '../date-options';
import Notification from '../notification';
import DueDateDetails from '../due-date-details';

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
        <span className={styles.done} onClick={this.done}>Done</span>
      );
    }

    if (this.state.canBeAdded || !this.state.adding) {
      addButton = (
        <span className={styles.add} onClick={this.add}>+ Add Another</span>
      );
    }

    /* let newNotification;
    if (this.props.appState && this.state.adding) {
      newNotification = (
        <div>
          <div className={classNames(styles.container, this.props.className)}>
            <div>
              <DateOptions
                warningValue={this.props.warningValue}
                warningPeriod={this.props.warningPeriod}
                id={this.props.id}
              />

              <span className={styles.cancel} onClick={this.cancel}>
                X CANCEL
              </span>
            </div>
            <textarea
              ref="reminderText"
              onChange={this.textChanged}
              className={styles.expirationMessage}
              placeholder="Enter the reminder text here"
              value={this.props.appState.newNotification.reminderText}
              aria-label="Notification text"
            >
            </textarea>
          </div>
        </div>
      );
    }
*/
    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <DueDateDetails
          isRollingDueDate={this.props.isRollingDueDate}
          dueDate={this.props.dueDate}
        />

        {/*<div className={styles.dateDetailSection}>
          {notifications}

          {newNotification}

          <div className={styles.buttons}>
            {doneButton}
            {addButton}
          </div>
        </div>*/}
      </div>
    );
  }
}
