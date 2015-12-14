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
import EditLink from '../EditLink';
import DeleteLink from '../DeleteLink';
import DoneLink from '../DoneLink';
import DateOptions from './DateOptions';

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
    const styles = {
      container: {
        marginBottom: 40
      },
      edit: {
        marginRight: 10
      },
      done: {
      },
      delete: {
      },
      reminderText: {
        display: 'block',
        width: '100%',
        fontSize: 16,
        margin: '7px 5px 30px 5px',
        color: '#333',
        whiteSpace: 'pre',
        wordWrap: 'break-word'
      },
      reminderTextbox: {
        display: 'block',
        width: '100%',
        padding: 10,
        fontSize: 16,
        marginTop: 10
      }
    };

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
          style={styles.reminderTextbox}
          placeholder="Enter the reminder text here"
          defaultValue={this.props.reminderText}>
        </textarea>
      );

      buttons = (
        <span style={{float: 'right'}}>
          <DoneLink style={styles.done} onClick={this.done} />
        </span>
      );
    } else {
      reminderText = (
        <div style={styles.reminderText}>
          {this.props.reminderText}
        </div>
      );

      buttons = (
        <span style={{float: 'right'}}>
          <EditLink style={styles.edit} onClick={this.edit} />
          <DeleteLink style={styles.delete} onClick={this.delete} />
        </span>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
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
