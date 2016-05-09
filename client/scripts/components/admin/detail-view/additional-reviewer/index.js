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
import { AdminActions } from '../../../../actions/admin-actions';
import { formatDateTime } from '../../../../format-date';
import classNames from 'classnames';
import { DATE_TYPE } from '../../../../../../coi-constants';

export default class AdditionalReviewer extends React.Component {
  constructor() {
    super();

    this.removeAdditionalReviewer = this.removeAdditionalReviewer.bind(this);
    this.reassignAdditionalReviewer = this.reassignAdditionalReviewer.bind(this);
  }

  removeAdditionalReviewer() {
    AdminActions.removeAdditionalReviewer(this.props.id);
  }

  reassignAdditionalReviewer() {
    AdminActions.reassignAdditionalReviewer(this.props.id);
  }

  render() {
    const sortedDates = this.props.dates.sort((a,b) => {
      return new Date(a.date) - new Date(b.date);
    });

    const dates = sortedDates.map((date,index) => {
      const message = date.type === DATE_TYPE.COMPLETED ?
        'Review Completed on ' :
        'Reviewer Assigned on ';

      return (
        <div key={index} className={styles.dates}>
          {`${message}${formatDateTime(date.date)}`}
        </div>
      );
    });

    const completedReview = sortedDates[sortedDates.length - 1].type === DATE_TYPE.COMPLETED;
    const completedReviewOnce = sortedDates.some(date => date.type === DATE_TYPE.COMPLETED);
    let removeButton;
    if (!completedReviewOnce && !this.props.readOnly) {
      removeButton = (
        <button
          id="remove_button"
          className={styles.button}
          onClick={this.removeAdditionalReviewer}
        >
          <i className={`fa fa-times`} style={{marginRight:'5px'}}></i>
          Remove Reviewer
        </button>
      );
    }

    let reassignButton;
    if (completedReview && !this.props.readOnly) {
      reassignButton = (
        <button
          id="reassign_button"
          className={styles.button}
          onClick={this.reassignAdditionalReviewer}
        >
          Reassign
        </button>
      );
    }

    let check;
    if (completedReview) {
      check = (
        <i id='check_icon' className={`fa fa-check ${styles.icon}`}></i>
      );
    }

    const nameClasses = classNames(styles.name,
      {[styles.check]: completedReview});

    return (
      <div className={styles.container}>
        <div className={styles.content}>

          <div className={nameClasses}>
            {check}{this.props.name}
          </div>
          <div className={styles.email}>
            {this.props.email}
          </div>
        </div>
        <div className={styles.buttons}>
          <div style={{display: 'inline-block'}}>
            {dates}
          </div>

          {removeButton}
          {reassignButton}
        </div>
      </div>
    );
  }
}