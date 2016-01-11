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
import {GreyButton} from '../../../GreyButton';
import {formatDate} from '../../../../formatDate';
import ConfigStore from '../../../../stores/ConfigStore';
import {COIConstants} from '../../../../../../COIConstants';
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
    const updateable = this.props.status === COIConstants.DISCLOSURE_STATUS.IN_PROGRESS ||
      this.props.status === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE ||
      this.props.status === COIConstants.DISCLOSURE_STATUS.EXPIRED;

    const revisable = this.props.status === COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED;

    let extraInfo;
    if (this.props.expiresOn) {
      extraInfo = (
        <span role="gridcell" className={`${styles.cell} ${styles.one}`}>
          <div className={styles.type}>{ConfigStore.getDisclosureTypeString(this.props.type)}</div>
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
          <div className={styles.type}>{ConfigStore.getDisclosureTypeString(this.props.type)}</div>
        </span>
      );
    }
    if (updateable) {
      extraInfo = this.wrapWithUpdateLink(extraInfo);
    }
    else if (revisable) {
      extraInfo = this.wrapWithReviseLink(extraInfo);
    }

    let status = (
      <span role="gridcell" className={`${styles.cell} ${styles.two}`}>
        {ConfigStore.getDisclosureStatusString(this.props.status)}
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
