import React from 'react/addons';
import {merge} from '../../../merge';
import {ProminentButton} from '../../ProminentButton';
import {formatDate} from '../../../formatDate';

export class Entry extends React.Component {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  render() {
    let styles = {
      container: {
        marginTop: '44px',
        backgroundColor: 'white',
        padding: '10px 20px',
        borderRadius: 5
      },
      entityName: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '35%',
        display: 'inline-block'
      },
      left: {
        width: '80%',
        display: 'inline-block'
      },
      midDot: {
        float: 'right',
        marginRight: '10px'
      },
      dates: {
        width: '55%',
        display: 'inline-block'
      },
      label: {
        fontSize: 14,
        marginRight: '5px'
      },
      reason: {
        marginTop: 10
      },
      data: {
        fontWeight: 550
      },
      buttons: {
        width: '20%',
        display: 'inline-block'
      },
      button: {
        margin: '5'
      },
      amount: {
        width: '55%',
        display: 'inline-block'
      },
      destination: {
        width: '35%',
        display: 'inline-block'
      },
      middle: {
        marginTop: 10
      }
    };
    styles = merge(this.commonStyles, styles);

    return (
      <div style={styles.container}>
        <div>
          <div style={styles.left}>
            <div>
              <div name="Name" style={styles.entityName}>
                {this.props.travelLog.entityName}
                <span style={styles.midDot}>&middot;</span>
              </div>
              <div style={styles.dates}>
                <span style={styles.label}>Dates:</span>
                <span name="Dates" data-for={this.props.travelLog.entityName} style={styles.data}>{formatDate(this.props.travelLog.startDate)} - {formatDate(this.props.travelLog.endDate)}</span>
              </div>
            </div>
            <div style={styles.middle}>
              <div style={styles.destination}>
                <span style={styles.label}>Destination:</span>
                <span name="Destination" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.destination}</span>
              </div>
              <div style={styles.amount}>
                <span style={styles.label}>Amount:</span>
                <span name="Amount" data-for={this.props.travelLog.entityName} style={styles.data}>${this.props.travelLog.amount}</span>
              </div>
            </div>
            <div style={styles.reason}>
              <span style={styles.label}>Reason:</span>
              <span name="Reason" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.reason}</span>
            </div>
          </div>
          <div style={styles.buttons}>
            <ProminentButton name="Edit" data-for={this.props.travelLog.entityName} style={styles.button}>Edit</ProminentButton>
            <ProminentButton name="Delete" data-for={this.props.travelLog.entityName} style={styles.button}>Delete</ProminentButton>
          </div>
        </div>
      </div>
    );
  }

}
