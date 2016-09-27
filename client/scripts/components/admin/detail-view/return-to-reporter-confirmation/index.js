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
import {GreyButton} from '../../../grey-button';
import {BlueButton} from '../../../blue-button';
import {AdminActions} from '../../../../actions/admin-actions';
import classNames from 'classnames';

export default class ReturnToReporterConfirmation extends React.Component {
  constructor() {
    super();
    this.returnToReporter = this.returnToReporter.bind(this);
  }

  render() {
    let returnToReporterSection;
    if (this.props.showReturnToReporterConfirmation) {
      if (!this.props.areReviewCommentsvisibleToReporter) {
        returnToReporterSection = (
          <div className={classNames(styles.container)}>
            <div className={styles.question}>
              Are you sure you want to return this disclosure to the reporter?
            </div>

            <div>
              COMMENT
            </div>
            <div>
              <textarea
                className={styles.textbox}
                onChange={AdminActions.updateGeneralComment}
                value={this.props.returnToReporterComment.text}
              />
            </div>
            <BlueButton
              onClick={AdminActions.returnToReporter}
              className={`${styles.override} ${styles.yesButton}`}
            >
              YES, SUBMIT
            </BlueButton>
            <GreyButton
              onClick={AdminActions.toggleReturnToReporterConfirmation}
              className={`${styles.override} ${styles.button}`}
            >
              NO, CANCEL
            </GreyButton>
          </div>
        );
      } else {
        returnToReporterSection = (
          <div className={classNames(styles.container)}>
            <div className={styles.question}>
              There are review comments set as visible to the reporter. To Return the disclosure, please set these as
              not visible to the reporter.
            </div>
            <GreyButton
              onClick={AdminActions.toggleReturnToReporterConfirmation}
              className={`${styles.override} ${styles.button}`}
            >
              CLOSE
            </GreyButton>
          </div>
        );
      }
    }
    return (
      <div>
        {returnToReporterSection}
      </div>
    );
  }
}
