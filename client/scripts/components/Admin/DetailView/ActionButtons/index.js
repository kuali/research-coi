/* @flow */
/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import React from 'react';
import {merge} from '../../../merge';
import {AdminActions} from '../../../actions/AdminActions';

export default function ActionButtons(props: Object): React.Element {
  const styles = {
    container: {
      color: '#6d6d6d',
      fontSize: 15,
      width: 210
    },
    icon: {
      backgroundColor: window.colorBlindModeOn ? 'black' : '#F57C00',
      color: 'white',
      padding: 5,
      display: 'inline-block',
      borderRadius: 60,
      marginRight: 7
    },
    sendBackIcon: {
      fontSize: 16,
      width: 25,
      paddingLeft: 6
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

  if (props.showAttachments) {
    const generalAttachmentStyle = merge(styles.button, {borderBottom: '1px solid grey', paddingBottom: 10});
    generalAttachmentButton = (
      <div style={generalAttachmentStyle} onClick={AdminActions.showGeneralAttachmentsPanel}>
        <i className="fa fa-eye" style={styles.icon}></i>
        <span style={styles.label}>VIEW GENERAL<br/>ATTACHMENTS</span>
      </div>
    );
  }

  let approveButton;
  let sendBackButton;
  if (!props.readonly) {
    approveButton = (
      <div onClick={AdminActions.toggleApprovalConfirmation} style={styles.button}>
        <i className="fa fa-check" style={styles.icon}></i>
        <span style={styles.label}>APPROVE</span>
      </div>
    );

    sendBackButton = (
      <div onClick={AdminActions.toggleRejectionConfirmation} style={styles.button}>
        <i className="fa fa-times" style={merge(styles.icon, styles.sendBackIcon)}></i>
        <span style={styles.label}>SEND BACK</span>
      </div>
    );
  }

  return (
    <div style={merge(styles.container, props.style)} >
      {generalAttachmentButton}
      {approveButton}
      {sendBackButton}
      <div onClick={AdminActions.showAdditionalReviewPanel} style={styles.button}>
        <i className="fa fa-eye" style={styles.icon}></i>
        <span style={styles.label}>
          <div>ADDITIONAL REVIEW</div>
        </span>
      </div>
      <div onClick={AdminActions.showCommentSummary} style={styles.button}>
        <i className="fa fa-binoculars" style={styles.icon}></i>
        <span style={styles.label}>
          <div>REVIEW COMMENTS</div>
        </span>
      </div>
    </div>
  );
}
