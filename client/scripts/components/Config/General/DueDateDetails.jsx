import React from 'react/addons';
import {DatePicker} from '../../DatePicker';
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';

export default class DueDateDetails extends React.Component {
  constructor() {
    super();

    this.setDueDate = this.setDueDate.bind(this);
    this.makeRolling = this.makeRolling.bind(this);
    this.makeStatic = this.makeStatic.bind(this);
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

  setDueDate(newDate) {
    ConfigActions.setDueDate(newDate);
  }

  render() {
    let styles = {
      container: {
        marginLeft: this.props.showTitleQuestion ? 0 : 20,
        marginBottom: 15
      },
      notificationQuestion: {
        fontWeight: 'bold',
        margin: '5px 0 17px 0',
        textAlign: 'center'
      },
      dueDateOptions: {
        paddingBottom: 15
      },
      dueDataType: {
        flex: 1,
        fontSize: 17
      },
      checkbox: {
        marginRight: 10
      },
      datepicker: {
        marginTop: 4
      },
      title: {
        fontSize: 12,
        marginBottom: 10
      }
    };

    let dueDate;
    if (this.props.isRollingDueDate === false) {
      dueDate = (
        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <div>
            <DatePicker id="dueDate" style={styles.datepicker} onChange={this.setDueDate} value={this.props.dueDate} />
          </div>
        </div>
      );
    }

    let heading;
    if (this.props.showTitleQuestion) {
      heading = (
        <div style={styles.notificationQuestion}>How are your institution's due dates set up?</div>
      );
    }
    else {
      heading = (
        <div style={styles.title}>DISCLOSURE DUE DATES</div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        {heading}
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
      </div>
    );
  }
}
