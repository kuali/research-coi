/* @flow */
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
import ProgressIndicator from './ProgressIndicator';
import {DisclosureActions} from '../../actions/DisclosureActions';
import NextLink from './NextLink';
import SubmitLink from './SubmitLink';
import PreviousLink from './PreviousLink';

export class NavSidebar extends React.Component {
  constructor() {
    super();

    this.submitDisclosure = this.submitDisclosure.bind(this);
  }

  submitDisclosure() {
    if (!this.props.submitDisabled) {
      DisclosureActions.submitDisclosure();
    }
  }

  render(): React.Element {
    let styles = {
      navigation: {
        verticalAlign: 'top',
        width: '25%',
        paddingTop: 55,
        textAlign: 'center'
      },
      stepButtons: {
        textAlign: 'left',
        display: 'inline-block'
      },
      link: {
        margin: '14px 0 14px 0'
      }
    };

    let nextLink;
    if (this.props.showNextLink) {
      nextLink = (
        <NextLink
          onClick={DisclosureActions.nextStep}
          style={styles.link}
        />
      );
    }

    let submitLink;
    if (this.props.showSubmitLink) {
      submitLink = (
        <SubmitLink
          onClick={this.submitDisclosure}
          disabled={this.props.submitDisabled}
          style={styles.link}
        />
      );
    }

    let previousLink;
    if (this.props.showPreviousLink) {
      previousLink = (
        <PreviousLink
          onClick={DisclosureActions.previousQuestion}
          style={styles.link}
          label={this.props.previousLabel}
        />
      );
    }

    return (
      <span style={styles.navigation}>
        <div onClick={this.advance}>
          <ProgressIndicator
            percent={this.props.percentComplete}
            useColor={!window.colorBlindModeOn}
          />
        </div>

        <div style={styles.stepButtons}>
          {previousLink}
          {submitLink}
          {nextLink}
        </div>
      </span>
    );
  }
}
