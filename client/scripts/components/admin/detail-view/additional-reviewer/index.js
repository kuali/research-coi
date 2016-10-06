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
import {last} from 'lodash';
import {AdminActions} from '../../../../actions/admin-actions';
import {formatDateTime} from '../../../../format-date';
import classNames from 'classnames';
import {DATE_TYPE} from '../../../../../../coi-constants';

export default class AdditionalReviewer extends React.Component {
  constructor() {
    super();

    this.removeAdditionalReviewer = this.removeAdditionalReviewer.bind(this);
    this.reassignReviewer = this.reassignReviewer.bind(this);
  }

  removeAdditionalReviewer() {
    AdminActions.removeAdditionalReviewer(this.props.id);
  }

  reassignReviewer() {
    AdminActions.reassignAdditionalReviewer(this.props.id);
  }

  render() {
    const {props} = this;

    const sortedDates = props.dates.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    const datesJsx = sortedDates.map((date, index) => {
      let message;
      if (date.type === DATE_TYPE.COMPLETED) {
        message = 'Review Completed on';
      }
      else {
        message = 'Reviewer Assigned on';
      }

      return (
        <div key={index} className={styles.dates}>
          {`${message} ${formatDateTime(date.date)}`}
        </div>
      );
    });

    const completedReview = last(sortedDates).type === DATE_TYPE.COMPLETED;
    let removeButton;
    if (!completedReview && !props.readOnly) {
      removeButton = (
        <button
          id="remove_button"
          className={styles.button}
          onClick={this.removeAdditionalReviewer}
        >
          <i className={'fa fa-times'} style={{marginRight: 5}} />
          Remove Reviewer
        </button>
      );
    }

    let reassignButton;
    if (completedReview && !props.readOnly) {
      reassignButton = (
        <button
          id="reassign_button"
          className={styles.button}
          onClick={this.reassignReviewer}
        >
          Reassign
        </button>
      );
    }

    let check;
    if (completedReview) {
      check = (
        <i id='check_icon' className={`fa fa-check ${styles.icon}`} />
      );
    }

    const nameClasses = classNames(
      styles.name,
      {[styles.check]: completedReview}
    );

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={nameClasses}>
            {check}{props.name}
          </div>
          <div className={styles.email}>
            {props.email}
          </div>
        </div>
        <div className={styles.buttons}>
          <span>
            {datesJsx}
          </span>

          {removeButton}
          {reassignButton}
        </div>
      </div>
    );
  }
}

AdditionalReviewer.propTypes = {
  id: React.PropTypes.number.isRequired,
  dates: React.PropTypes.array.isRequired,
  readOnly: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string.isRequired,
  email: React.PropTypes.string
};

AdditionalReviewer.defaultProps = {
  dates: [],
  readOnly: false
};
