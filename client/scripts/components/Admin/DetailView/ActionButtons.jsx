import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
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

  showComments() {
    AdminActions.showCommentSummary();
  }

  showAdditionalReview() {
    AdminActions.showAdditionalReviewPanel();
  }

  showGeneralAttachments() {
    AdminActions.showGeneralAttachmentsPanel();
  }

  render() {
    let styles = {
      container: {
        color: '#6d6d6d',
        fontSize: 15,
        width: 210
      },
      icon: {
        backgroundColor: window.config.colors.three,
        color: 'white',
        padding: 5,
        display: 'inline-block',
        borderRadius: 60,
        marginRight: 7
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

    let generalAttachmentButton;

    if (this.props.showAttachments) {
      let generalAttachmentStyle = merge(styles.button, {borderBottom: '1px solid grey', paddingBottom: 10});
      generalAttachmentButton = (
        <div style={generalAttachmentStyle} onClick={this.showGeneralAttachments}>
          <i className="fa fa-eye" style={styles.icon}></i>
          <span style={styles.label}>VIEW GENERAL<br/>ATTACHMENTS</span>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        {generalAttachmentButton}
        <div onClick={this.approve} style={styles.button}>
          <i className="fa fa-check" style={styles.icon}></i>
          <span style={styles.label}>APPROVE</span>
        </div>
        <div onClick={this.reject} style={styles.button}>
          <i className="fa fa-rotate-left" style={styles.icon}></i>
          <span style={styles.label}>SEND BACK</span>
        </div>
        <div onClick={this.showAdditionalReview} style={styles.button}>
          <i className="fa fa-plus" style={styles.icon}></i>
          <span style={styles.label}>
            <div>ADDITIONAL REVIEW</div>
          </span>
        </div>
        <div onClick={this.showComments} style={styles.button}>
          <i className="fa fa-binoculars" style={styles.icon}></i>
          <span style={styles.label}>
            <div>REVIEW COMMENTS</div>
          </span>
        </div>
      </div>
    );
  }
}
