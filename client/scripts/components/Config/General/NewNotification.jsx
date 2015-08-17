import React from 'react/addons';
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';

export default class NewNotifications extends React.Component {
  constructor() {
    super();

    this.setWarningPeriod = this.setWarningPeriod.bind(this);
    this.setWarningValue = this.setWarningValue.bind(this);
    this.setReminderText = this.setReminderText.bind(this);
  }

  setWarningValue() {
    let warningValueSelect = React.findDOMNode(this.refs.warningValue);
    ConfigActions.setWarningValueOnNotification(undefined, warningValueSelect.value);
  }

  setWarningPeriod() {
    let warningPeriodSelect = React.findDOMNode(this.refs.warningPeriod);
    ConfigActions.setWarningPeriodOnNotification(undefined, warningPeriodSelect.value);
  }

  setReminderText() {
    let reminderTextbox = React.findDOMNode(this.refs.reminderText);
    ConfigActions.setReminderTextOnNotification(undefined, reminderTextbox.value);
  }

  render() {
    let styles = {
      container: {
      },
      warningValue: {
        margin: '0 5px'
      },
      warningPeriod: {
        marginRight: 5
      },
      cancel: {
        float: 'right',
        color: '#F44336',
        paddingLeft: 5,
        marginLeft: 25,
        paddingTop: 7,
        paddingBottom: 2,
        fontSize: 8,
        borderBottom: '1px dotted #F44336',
        cursor: 'pointer',
        verticalAlign: 'middle'
      },
      edit: {
        float: 'right'
      },
      expirationMessage: {
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

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div>
          Send
          <select ref="warningValue" value={this.props.warningValue} style={styles.warningValue} onChange={this.setWarningValue}>
            {warningValue}
          </select>
          <select ref="warningPeriod" value={this.props.warningPeriod} style={styles.warningPeriod} onChange={this.setWarningPeriod}>
            <option>Days</option>
            <option>Weeks</option>
            <option>Months</option>
          </select>
          before expiration

          <span style={styles.cancel}>
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
