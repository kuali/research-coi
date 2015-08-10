import React from 'react/addons';
import {merge} from '../../../merge';
import {DatePicker} from '../../DatePicker';
import ConfigActions from '../../../actions/ConfigActions';
import NewNotification from './NewNotification';
import Notification from './Notification';

export default class NotificationDetails extends React.Component {
  constructor() {
    super();
    this.setDueDate = this.setDueDate.bind(this);
    this.makeRolling = this.makeRolling.bind(this);
    this.makeStatic = this.makeStatic.bind(this);
  }

  setDueDate(newDate) {
    ConfigActions.setDueDate(newDate);
  }

  makeRolling() {
    let rollingRadio = React.findDOMNode(this.refs.rolling);
    if (rollingRadio.checked) {
      ConfigActions.setIsRollingDueDate(true);
    }
  }

  makeStatic() {
    let staticRadio = React.findDOMNode(this.refs.static);
    if (staticRadio.checked) {
      ConfigActions.setIsRollingDueDate(false);
    }
  }

  render() {
    let styles = {
      container: {
        padding: '10px 25px'
      },
      checkbox: {
        marginRight: 10
      },
      notificationQuestion: {
        fontWeight: 'bold',
        margin: '5px 0 17px 0'
      },
      dueDateOptions: {
        paddingBottom: 15
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
        color: '#048EAF',
        marginTop: 20,
        fontSize: 17
      },
      add: {
        cursor: 'pointer'
      },
      datepicker: {
        marginTop: 4
      }
    };

    let dueDate;
    if (this.props.isRollingDueDate === false) {
      dueDate = (
        <div>
          <div>Due Date:</div>
          <div>
            <DatePicker id="dueDate" style={styles.datepicker} onChange={this.setDueDate} value={this.props.dueDate} />
          </div>
        </div>
      );
    }

    let notifications;
    if (this.props.notifications) {
      notifications = this.props.notifications.map(notification => {
        return <Notification
                  key={notification.id}
                  id={notification.id}
                  warningValue={notification.warningValue}
                  warningPeriod={notification.warningPeriod}
                  reminderText={notification.reminderText}
               />;
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.notificationQuestion}>How are your institution's due dates set up?</div>
        <div style={styles.dueDateOptions}>
          <input
            type="radio"
            name="duedatetype"
            id="static"
            ref="static"
            onChange={this.makeStatic}
            style={styles.checkbox}
            checked={this.props.isRollingDueDate === false}
          />
          <label htmlFor="static" style={{marginRight: 50}}>Static Annual Due Date</label>
          <input
            type="radio"
            name="duedatetype"
            id="rolling"
            ref="rolling"
            onChange={this.makeRolling}
            style={styles.checkbox}
            checked={this.props.isRollingDueDate}
          />
          <label htmlFor="rolling">Rolling Annual Due Date</label>
        </div>

        {dueDate}

        <div style={styles.dateDetailSection}>
          <div>
            {notifications}
          </div>

          <NewNotification
            warningPeriod={this.props.appState ? this.props.appState.newNotification.warningPeriod : undefined}
            warningValue={this.props.appState ? this.props.appState.newNotification.warningValue : undefined}
            reminderText={this.props.appState ? this.props.appState.newNotification.reminderText : undefined}
          />

          <div style={styles.buttons}>
            <span style={styles.done} onClick={ConfigActions.saveNewNotification}>Done</span>
            <span style={styles.add} onClick={ConfigActions.saveNewNotification}>+ Add Another</span>
          </div>
        </div>
      </div>
    );
  }
}
