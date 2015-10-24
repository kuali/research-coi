import React from 'react/addons';
import {merge} from '../../../merge';
import {DatePicker} from '../../DatePicker';
import ConfigActions from '../../../actions/ConfigActions';
import DateOptions from './DateOptions';
import Notification from './Notification';

export default class NotificationDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      adding: true,
      canBeAdded: false
    };

    this.setDueDate = this.setDueDate.bind(this);
    this.makeRolling = this.makeRolling.bind(this);
    this.makeStatic = this.makeStatic.bind(this);
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
    console.log('being called');
    let textarea = React.findDOMNode(this.refs.reminderText);
    this.setState({
      canBeAdded: textarea.value.length > 0
    });
    ConfigActions.setReminderTextOnNotification(undefined, textarea.value);
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
        padding: '10px 0',
        maxWidth: 646,
        margin: '0 auto'
      },
      checkbox: {
        marginRight: 10
      },
      notificationQuestion: {
        fontWeight: 'bold',
        margin: '5px 0 17px 0',
        textAlign: 'center'
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
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        marginTop: 20,
        fontSize: 17,
        height: 21
      },
      add: {
        cursor: 'pointer'
      },
      datepicker: {
        marginTop: 4
      },
      dueDataType: {
        flex: 1,
        fontSize: 17
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
        border: '1px solid #AAA',
        resize: 'none'
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
    if (this.props.notifications && this.props.notifications.length > 0) {
      notifications = this.props.notifications.map((notification, index) => {
        return <Notification
                  key={index}
                  id={notification.id}
                  warningValue={notification.warningValue}
                  warningPeriod={notification.warningPeriod}
                  reminderText={notification.reminderText}
               />;
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
              value={this.props.appState.newNotification.reminderText}>
            </textarea>
          </div>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.notificationQuestion}>How are your institution's due dates set up?</div>
        <div className="flexbox row" style={styles.dueDateOptions}>
          <span style={styles.dueDataType}>
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
          </span>
          <span style={styles.dueDataType}>
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
          </span>
        </div>

        {dueDate}

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
