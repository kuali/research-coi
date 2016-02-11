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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {BlueButton} from '../../../blue-button';
import {Link} from 'react-router';
import PIReviewActions from '../../../../actions/pi-review-actions';

export default class SidePanel extends React.Component {
  constructor() {
    super();

    this.state = {
      agreed: false
    };

    this.onAgreeChange = this.onAgreeChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  onAgreeChange(evt) {
    this.setState({
      agreed: evt.target.checked
    });
  }

  confirm() {
    if (this.state.agreed) {
      this.props.onConfirm();
    }
  }

  render() {
    const submitEnabled = this.props.submitEnabled;

    let content;
    if (this.props.showingCertification) {
      content = (
        <div className={styles.certificationPane}>
          <div>{this.props.certificationText}</div>
          <div className={styles.certCheckbox}>
            <input type="checkbox" id="certCheck" onChange={this.onAgreeChange} />
            <label className={styles.agreedLabel} htmlFor="certCheck">Agreed</label>
          </div>
          <div className={styles.confirmSection}>
            <BlueButton
              onClick={this.confirm}
              className={classNames(
                styles.override,
                {[styles.disabledConfirmButton]: !this.state.agreed}
              )}
            >
              Confirm
            </BlueButton>
          </div>
        </div>
      );
    }
    else {
      let message;
      if (submitEnabled) {
        message = 'Yeah, you did it!  You addressed all the review comments.  Now just submit to send back for approval.';
      }
      else {
        message = 'Please either revise or respond to each section before resubmitting.';
      }
      content = (
        <div>
          <div className={styles.message}>{message}</div>
          <div className={styles.submit} onClick={PIReviewActions.submit}>
            <i className={`fa fa-arrow-circle-right ${styles.submitIcon}`}></i>
            SUBMIT
          </div>

          <Link to={`/coi/dashboard`}>
            <div className={styles.cancel}>
              <i className={`fa fa-times-circle ${styles.cancelIcon}`}></i>
              CANCEL
            </div>
          </Link>
        </div>
      );
    }

    const classes = classNames(
      styles.container,
      {[styles.submitEnabled]: submitEnabled},
      this.props.className
    );

    return (
      <span className={classes}>
        {content}
      </span>
    );
  }
}
