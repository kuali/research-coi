import React from 'react/addons';
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';
import DateOptions from './DateOptions';

export default class NewNotifications extends React.Component {
  constructor() {
    super();

    this.setReminderText = this.setReminderText.bind(this);
  }

  setReminderText() {
    let reminderTextbox = React.findDOMNode(this.refs.reminderText);
    ConfigActions.setReminderTextOnNotification(undefined, reminderTextbox.value);
  }

  render() {
    let styles = {
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
