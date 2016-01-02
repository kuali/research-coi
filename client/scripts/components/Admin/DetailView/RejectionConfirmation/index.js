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
import React from 'react';
import {GreyButton} from '../../../GreyButton';
import {BlueButton} from '../../../BlueButton';
import {AdminActions} from '../../../../actions/AdminActions';
import classNames from 'classnames';

export default class RejectionConfirmation extends React.Component {
  constructor() {
    super();
    this.reject = this.reject.bind(this);
  }

  reject() {
    AdminActions.rejectDisclosure();
  }

  render() {
    let rejectionSection;
    if (this.props.canReject) {
      rejectionSection = (
        <div className={classNames(styles.container, this.props.className)}>
          <div className={styles.question}>
            Are you sure you want to send this disclosure back for further review?
          </div>

          <div className={styles.generalComments}>NOTIFICATION TO USER</div>
          <textarea ref="comments" className={styles.commentText} />

          <BlueButton
            onClick={this.reject}
            className={`${styles.override} ${styles.yesButton}`}
          >
            YES, SUBMIT
          </BlueButton>
          <GreyButton
            onClick={AdminActions.toggleRejectionConfirmation}
            className={`${styles.override} ${styles.button}`}
          >
            NO, CANCEL
          </GreyButton>
        </div>
      );
    } else {
      rejectionSection = (
        <div className={classNames(styles.container, this.props.className)}>
          <div className={styles.question}>
            Please add one or more comments visible to the PI before sending back a disclosure.
          </div>

          <GreyButton
            onClick={AdminActions.toggleRejectionConfirmation}
            className={`${styles.override} ${styles.button}`}
          >
            CLOSE
          </GreyButton>
        </div>
      );
    }
    return (
      <div>
        {rejectionSection}
      </div>
    );
  }
}
