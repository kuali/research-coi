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
import {AdminActions} from '../../../../actions/AdminActions';
import styles from './style';
import classNames from 'classnames';

export default function ActionButtons(props) {
  let generalAttachmentButton;
  if (props.showAttachments) {
    generalAttachmentButton = (
      <div
        className={styles.button}
        style={{borderBottom: '1px solid grey', paddingBottom: 10}}
        onClick={AdminActions.showGeneralAttachmentsPanel}
      >
        <i className={`fa fa-eye ${styles.icon}`}></i>
        <span className={styles.label}>VIEW GENERAL<br/>ATTACHMENTS</span>
      </div>
    );
  }

  let approveButton;
  let sendBackButton;
  if (!props.readonly) {
    approveButton = (
      <div className={styles.button} onClick={AdminActions.toggleApprovalConfirmation}>
        <i className={`fa fa-check ${styles.icon}`}></i>
        <span className={styles.label}>APPROVE</span>
      </div>
    );

    sendBackButton = (
      <div className={styles.button} onClick={AdminActions.toggleRejectionConfirmation}>
        <i className={`fa fa-times ${styles.icon} ${styles.sendBackIcon}`}></i>
        <span className={styles.label}>SEND BACK</span>
      </div>
    );
  }

  return (
    <div className={classNames(styles.container, props.className)}>
      {generalAttachmentButton}
      {approveButton}
      {sendBackButton}
      <div className={styles.button} onClick={AdminActions.showAdditionalReviewPanel}>
        <i className={`fa fa-eye ${styles.icon}`}></i>
        <span className={styles.label}>
          <div>ADDITIONAL REVIEW</div>
        </span>
      </div>
      <div className={styles.button} onClick={AdminActions.showCommentSummary}>
        <i className={`fa fa-binoculars ${styles.icon}`}></i>
        <span className={styles.label}>
          <div>REVIEW COMMENTS</div>
        </span>
      </div>
    </div>
  );
}
