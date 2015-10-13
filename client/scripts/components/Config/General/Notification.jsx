import React from 'react/addons';
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
    let textarea = React.findDOMNode(this.refs.reminderText);
    ConfigActions.setReminderTextOnNotification(this.props.id, textarea.value);
    this.setState({
      editing: false
    });
  }

  render() {
    let styles = {
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

    let warningValue = [];
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
