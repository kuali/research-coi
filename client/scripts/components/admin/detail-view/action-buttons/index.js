/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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
import {AdminActions} from '../../../../actions/admin-actions';
import styles from './style';
import classNames from 'classnames';
import { ROLES } from '../../../../../../coi-constants';

export default function ActionButtons(props) {
  let generalAttachmentButton;
  if (props.showAttachments) {
    generalAttachmentButton = (
      <div
        name='General Attachments Button'
        className={styles.button}
        style={{borderBottom: '1px solid grey', paddingBottom: 10}}
        onClick={AdminActions.showGeneralAttachmentsPanel}
      >
        <i className={`fa fa-eye ${styles.icon}`} />
        <span className={styles.label}>VIEW GENERAL<br/>ATTACHMENTS</span>
      </div>
    );
  }

  let approveButton;
  let sendBackButton;
  if (!props.readonly && props.role === ROLES.ADMIN) {
    approveButton = (
      <div
        name='Approve Button'
        className={styles.button}
        onClick={AdminActions.toggleApprovalConfirmation}
      >
        <i className={`fa fa-check ${styles.icon}`} />
        <span className={styles.label}>APPROVE</span>
      </div>
    );

    sendBackButton = (
      <div
        name='Send Back Button'
        className={styles.button}
        onClick={AdminActions.toggleRejectionConfirmation}
      >
        <i className={`fa fa-times ${styles.icon} ${styles.sendBackIcon}`} />
        <span className={styles.label}>SEND BACK</span>
      </div>
    );
  }

  let additionalReviewButton;
  let uploadAttachmentsButton;

  if (props.role === ROLES.ADMIN) {
    additionalReviewButton = (
      <div name='Additional Review Button'
        className={styles.button}
        onClick={AdminActions.showAdditionalReviewPanel}
      >
        <i className={`fa fa-eye ${styles.icon}`} />
        <span className={styles.label}>
          <div>ADDITIONAL REVIEW</div>
        </span>
      </div>
    );

    uploadAttachmentsButton = (
      <div
        name='Upload Attachments Button'
        className={styles.button}
        onClick={AdminActions.showUploadAttachmentsPanel}
      >
        <i className={`fa fa-download ${styles.icon}`} />
        <span className={styles.label}>
          <div>UPLOAD ATTACHMENTS</div>
        </span>
      </div>
    );
  }

  let completeReviewButton;

  if (props.role === ROLES.REVIEWER) {
    completeReviewButton = (
      <div
        name='Complete Review'
        className={styles.button}
        onClick={AdminActions.completeReview}
      >
        <i className={`fa fa-check ${styles.icon}`} />
        <span className={styles.label}>COMPLETE REVIEW</span>
      </div>
    );
  }

  return (
    <div name='Action Buttons' className={classNames(styles.container, props.className)}>
      {generalAttachmentButton}
      {completeReviewButton}
      {approveButton}
      {sendBackButton}
      {additionalReviewButton}
      <div
        name='Review Comments Button'
        className={styles.button}
        onClick={AdminActions.showCommentSummary}
      >
        <i className={`fa fa-binoculars ${styles.icon}`} />
        <span className={styles.label}>
          <div>REVIEW COMMENTS</div>
        </span>
      </div>
      {uploadAttachmentsButton}

    </div>
  );
}
