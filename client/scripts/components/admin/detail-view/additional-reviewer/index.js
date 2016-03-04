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
import { formatDate } from '../../../../format-date';
import classNames from 'classnames';
import { DATE_TYPE } from '../../../../../../coi-constants';

export default class AdditionalReviewer extends React.Component {
  constructor() {
    super();

    this.removeAdditionalReviewer = this.removeAdditionalReviewer.bind(this);
  }

  removeAdditionalReviewer() {
    AdminActions.removeAdditionalReviewer(this.props.id);
  }

  render() {
    const dates = this.props.dates.map((date,index) => {
      const message = date.type === DATE_TYPE.COMPLETED ?
        'Review Completed on ' :
        'Reviewer Assigned on ';

      return (
        <div key={index} className={styles.dates}>
          {`${message}${formatDate(date.date)}`}
        </div>
      );
    });

    const completedReview = this.props.dates.filter(date => date.type === DATE_TYPE.COMPLETED).length > 0;

    let removeButton;
    if (!completedReview && !this.props.readOnly) {
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
        </div>
      </div>
    );
  }
}