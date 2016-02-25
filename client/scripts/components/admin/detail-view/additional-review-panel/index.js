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

import styles from './style';
import React from 'react';
import {AdminActions} from '../../../../actions/admin-actions';
import {FileUpload} from '../../../file-upload';
import AutoSuggest from '../../../auto-suggest';
import Suggestion from '../reviewer-suggestion';
import AdditionalReviewer from '../additional-reviewer';
import { DISCLOSURE_STATUS } from '../../../../../../coi-constants';

import classNames from 'classnames';

export default function AdditionalReviewPanel(props) {
  let additionalReview;
  if (props.reviewers.length > 0) {
    const reviewers = props.reviewers.map((reviewer, index) => {
      return (
        <AdditionalReviewer
          index={index}
          key={reviewer.userId}
          {...reviewer}
        />
      );
    });

    additionalReview = (
      <div className={styles.reviewers}>
        <span className={styles.reviewerLabel}>Additional Reviewers</span>
        {reviewers}
      </div>
    );
  } else {
    additionalReview = (
      <div className={styles.noReviewers}>
        You have not assigned additional reviewers to this disclosure.<br/>
        Search for reviewers above to add here.
      </div>
    );
  }

  let reviewerSearch;
  if ([DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL, DISCLOSURE_STATUS.RESUBMITTED].includes(props.statusCd)) {
    reviewerSearch = (
      <div>
        <label style={{fontSize: '12px', paddingBottom: '5px', color: '#777'}}>SEARCH REVIEWERS</label>
        <AutoSuggest
          suggestion={Suggestion}
          endpoint='/api/coi/reviewers'
          value={props.reviewerSearchValue}
          onSuggestionSelected={AdminActions.addAdditionalReviewer}
          className={styles.autoSuggest}
          inline={false}
        />
      </div>
  );
  }

  return (
    <div className={classNames(styles.container, props.className)}>
      <div style={{paddingBottom: 20}}>
        <span className={styles.close} onClick={AdminActions.hideAdditionalReviewPanel}>
          <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
        </span>
        <span className={styles.title}>ADDITIONAL REVIEW</span>
      </div>

      <div style={{paddingTop: 12, marginBottom: 25}}>
        <span className={styles.subLabel}>MANAGEMENT PLAN</span>
      </div>

      <FileUpload
        fileType='Management Plan'
        readonly={props.readonly}
        onDrop={AdminActions.addManagementPlan}
        delete={AdminActions.deleteManagementPlan}
        files={props.managementPlan}
        multiple={true}
        className={`${styles.override} ${styles.fileUploadStyles}`}
      >
        <div>Drag and drop or upload your management plan</div>
        <div style={{fontSize: 10, marginTop: 2}}>Acceptable Formats: .pdf, .png, .doc, .jpeg</div>
      </FileUpload>

      <div style={{paddingTop: 12, borderTop: '1px solid #777'}}>
        <div style={{paddingTop: 12, marginBottom: 15}}>
          <span className={styles.subLabel}>ADDITIONAL REVIEWERS</span>
        </div>
        {reviewerSearch}
        {additionalReview}
      </div>


    </div>
  );
}
