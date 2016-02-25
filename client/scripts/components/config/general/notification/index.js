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
import EditLink from '../../edit-link';
import DeleteLink from '../../delete-link';
import DoneLink from '../../done-link';
import DateOptions from '../date-options';

export default class Notification extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false
    };

    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.done = this.done.bind(this);
  }

  edit() {
    this.setState({
      editing: true
    });
  }

  delete() {
    ConfigActions.deleteNotification(this.props.id);
  }

  done() {
    const textarea = this.refs.reminderText;
    ConfigActions.setReminderTextOnNotification(this.props.id, textarea.value);
    this.setState({
      editing: false
    });
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

    let reminderText;
    let buttons;
    if (this.state.editing) {
      reminderText = (
        <textarea
          ref="reminderText"
          className={styles.reminderTextbox}
          placeholder="Enter the reminder text here"
          defaultValue={this.props.reminderText}
        >
        </textarea>
      );

      buttons = (
        <span style={{float: 'right'}}>
          <DoneLink onClick={this.done} />
        </span>
      );
    } else {
      reminderText = (
        <div className={styles.reminderText}>
          {this.props.reminderText}
        </div>
      );

      buttons = (
        <span style={{float: 'right'}}>
          <EditLink className={`${styles.override} ${styles.edit}`} onClick={this.edit} />
          <DeleteLink onClick={this.delete} />
        </span>
      );
    }

    return (
      <div className={classNames(styles.container, this.props.className)}>
        {buttons}

        <div>
          <DateOptions
            warningValue={this.props.warningValue}
            warningPeriod={this.props.warningPeriod}
            id={this.props.id}
          />
        </div>

        {reminderText}
      </div>
    );
  }
}
