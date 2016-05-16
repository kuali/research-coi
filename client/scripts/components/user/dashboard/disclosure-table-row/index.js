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
import classNames from 'classnames';
import React from 'react';
import {GreyButton} from '../../../grey-button';
import {formatDate} from '../../../../format-date';
import {
  getDisclosureTypeString,
  getDisclosureStatusString
} from '../../../../stores/config-store';
import {COIConstants} from '../../../../../../coi-constants';
import {Link} from 'react-router';

export class DisclosureTableRow extends React.Component {
  wrapWithUpdateLink(dom) {
    return (
      <Link
        style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}}
        to={"/coi/disclosure"}
        query={{type: this.props.type }}
      >
        {dom}
      </Link>
    );
  }

  wrapWithReviseLink(dom) {
    return (
      <Link
        style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}}
        to={`/coi/revise/${this.props.disclosureId}`}
      >
        {dom}
      </Link>
    );
  }

  render() {
    const updateable = COIConstants.EDITABLE_STATUSES.includes(this.props.status);

    const revisable = this.props.status === COIConstants.DISCLOSURE_STATUS.REVISION_REQUIRED;

    let extraInfo;
    const disclosureType = getDisclosureTypeString(
      this.context.configState,
      this.props.type,
      this.props.configId
    );

    if (this.props.expiresOn) {
      extraInfo = (
        <span role="gridcell" className={`${styles.cell} ${styles.one}`}>
          <div className={styles.type}>{disclosureType}</div>
          <div className={styles.extra}>
            Expires On:
            <span style={{marginLeft: 3}}>
              {formatDate(this.props.expiresOn)}
            </span>
          </div>
        </span>
      );
    }
    else {
      extraInfo = (
        <span role="gridcell" className={`${styles.cell} ${styles.one}`}>
          <div className={styles.type}>{disclosureType}</div>
        </span>
      );
    }
    if (updateable) {
      extraInfo = this.wrapWithUpdateLink(extraInfo);
    }
    else if (revisable) {
      extraInfo = this.wrapWithReviseLink(extraInfo);
    }

    const disclosureStatus = getDisclosureStatusString(
      this.context.configState,
      this.props.status,
      this.props.configId
    );
    let status = (
      <span role="gridcell" className={`${styles.cell} ${styles.two}`}>
        {disclosureStatus}
      </span>
    );
    if (updateable) {
      status = this.wrapWithUpdateLink(status);
    }
    else if (revisable) {
      status = this.wrapWithReviseLink(status);
    }

    let lastReviewed = (
      <span role="gridcell" className={`${styles.cell} ${styles.three}`}>
        {this.props.lastreviewed ? formatDate(this.props.lastreviewed) : 'None'}
      </span>
    );
    if (updateable) {
      lastReviewed = this.wrapWithUpdateLink(lastReviewed);
    }
    else if (revisable) {
      lastReviewed = this.wrapWithReviseLink(lastReviewed);
    }

    let button;
    if (updateable) {
      button = this.wrapWithUpdateLink((
        <GreyButton>Update &gt;</GreyButton>
      ));
    } else if (revisable) {
      button = this.wrapWithReviseLink((
        <GreyButton>Revise &gt;</GreyButton>
      ));
    }

    let buttonColumn;
    if (this.props.showButtonColumn) {
      buttonColumn = (
        <span role="gridcell" className={`${styles.cell} ${styles.four}`}>
          {button}
        </span>
      );
    }

    const classes = classNames(
      styles.container,
      {[styles.showButtonColumn]: this.props.showButtonColumn},
      {[styles.annual]: this.props.type === 'Annual'},
      this.props.className
    );

    return (
      <div role="row" className={classes}>
        {extraInfo}
        {status}
        {lastReviewed}
        {buttonColumn}
      </div>
    );
  }
}

DisclosureTableRow.contextTypes = {
  configState: React.PropTypes.object
};
