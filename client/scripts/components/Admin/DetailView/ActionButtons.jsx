import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {ApproveIcon} from '../../DynamicIcons/ApproveIcon';
import {AddReviewerIcon} from '../../DynamicIcons/AddReviewerIcon';
import {InProgressIcon} from '../../DynamicIcons/InProgressIcon';
import {RecommendedStatusIcon} from '../../DynamicIcons/RecommendedStatusIcon';
import {SendBackIcon} from '../../DynamicIcons/SendBackIcon';
import {AdminActions} from '../../../actions/AdminActions';

export class ActionButtons extends React.Component {
  constructor() {
    super();
  }

  approve() {
    AdminActions.toggleApprovalConfirmation();
  }

  reject() {
    AdminActions.toggleRejectionConfirmation();
  }

  render() {
    let styles = {
      container: {
        color: '#6d6d6d',
        fontSize: 15,
        width: 210
      },
      icon: {
        width: 30,
        height: 30,
        verticalAlign: 'middle',
        display: 'inline-block',
        marginRight: 7,
        color: '#1481A3'
      },
      label: {
        display: 'inline-block',
        verticalAlign: 'middle'
      },
      button: {
        marginTop: 10,
        cursor: 'pointer'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div onClick={this.approve} style={styles.button}>
          <ApproveIcon style={styles.icon} />
          <span style={styles.label}>APPROVE</span>
        </div>
        <div onClick={this.reject} style={styles.button}>
          <SendBackIcon style={styles.icon} />
          <span style={styles.label}>SEND BACK</span>
        </div>
        <div style={styles.button}>
          <AddReviewerIcon style={styles.icon} />
          <span style={styles.label}>
            <div>ADDITIONAL REVIEW</div>
          </span>
        </div>
        <div style={styles.button}>
          <RecommendedStatusIcon style={styles.icon} />
          <span style={styles.label}>
            <div>REVIEW COMMENTS</div>
          </span>
        </div>
        <div style={styles.button}>
          <InProgressIcon style={styles.icon} />
          <span style={styles.label}>ACTION LOG</span>
        </div>
      </div>
    );
  }
}
