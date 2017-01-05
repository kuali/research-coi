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
import ProgressIndicator from '../progress-indicator';
import {DisclosureActions} from '../../../actions/disclosure-actions';
import NextLink from '../next-link';
import SubmitLink from '../submit-link';
import PreviousLink from '../previous-link';

export class NavSidebar extends React.Component {
  constructor() {
    super();

    this.nextClicked = this.nextClicked.bind(this);
    this.submitDisclosure = this.submitDisclosure.bind(this);
  }

  nextClicked() {
    if (!this.props.nextDisabled) {
      DisclosureActions.nextStep();
    }
  }

  submitDisclosure() {
    if (!this.props.submitDisabled) {
      DisclosureActions.submitDisclosure();
    }
  }

  render() {
    let nextLink;
    if (this.props.showNextLink) {
      nextLink = (
        <NextLink
          onClick={this.nextClicked}
          disabled={this.props.nextDisabled}
          className={`${styles.override} ${styles.link}`}
        />
      );
    }

    let submitLink;
    if (this.props.showSubmitLink) {
      submitLink = (
        <SubmitLink
          onClick={this.submitDisclosure}
          disabled={this.props.submitDisabled}
          className={`${styles.override} ${styles.link}`}
        />
      );
    }

    let previousLink;
    if (this.props.showPreviousLink) {
      previousLink = (
        <PreviousLink
          onClick={DisclosureActions.previousQuestion}
          className={`${styles.override} ${styles.link}`}
          label={this.props.previousLabel}
        />
      );
    }

    return (
      <span className={styles.navigation}>
        <div onClick={this.advance}>
          <ProgressIndicator
            percent={this.props.percentComplete}
            useColor={!window.colorBlindModeOn}
          />
        </div>

        <div className={styles.stepButtons}>
          {previousLink}
          {submitLink}
          {nextLink}
        </div>
      </span>
    );
  }
}
