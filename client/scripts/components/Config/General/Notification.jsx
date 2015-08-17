import React from 'react/addons';
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';
import EditLink from '../EditLink';

export default class Notification extends React.Component {
  constructor() {
    super();

    this.setWarningPeriod = this.setWarningPeriod.bind(this);
    this.setWarningValue = this.setWarningValue.bind(this);
  }

  setWarningValue() {
    let warningValueSelect = React.findDOMNode(this.refs.warningValue);
    ConfigActions.setWarningValueOnNotification(this.props.id, warningValueSelect.value);
  }

  setWarningPeriod() {
    let warningPeriodSelect = React.findDOMNode(this.refs.warningPeriod);
    ConfigActions.setWarningPeriodOnNotification(this.props.id, warningPeriodSelect.value);
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
        fontSize: 11,
        margin: '5px 0 30px 0',
        color: '#333'
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

          <EditLink style={styles.edit} />
        </div>
        <div style={styles.expirationMessage}>{this.props.reminderText}</div>
      </div>
    );
  }
}
