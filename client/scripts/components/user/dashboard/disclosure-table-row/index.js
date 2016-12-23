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
import {
  EDITABLE_STATUSES,
  DISCLOSURE_STATUS
} from '../../../../../../coi-constants';
import {Link} from 'react-router';

function wrapWithUpdateLink(dom, type) {
  return (
    <Link
      style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}}
      to={{pathname: '/coi/disclosure', query: {type}}}
    >
      {dom}
    </Link>
  );
}

function wrapWithReviseLink(dom, disclosureId) {
  return (
    <Link
      style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}}
      to={{pathname: `/coi/revise/${disclosureId}`}}
    >
      {dom}
    </Link>
  );
}

function wrapWithReadOnlyLink(dom, disclosureId) {
  return (
    <Link
      style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}}
      to={{pathname: `/coi/readonly/${disclosureId}`}}
    >
      {dom}
    </Link>
  );
}

export default function DisclosureTableRow(props, {configState}) {
  const {
    status,
    type,
    configId,
    expiresOn,
    lastreviewed,
    className,
    disclosureId
  } = props;
  const updateable = EDITABLE_STATUSES.includes(status);
  const revisable = status === DISCLOSURE_STATUS.REVISION_REQUIRED;
  const disclosureType = getDisclosureTypeString(
    configState,
    type,
    configId
  );

  let extraInfo;
  if (expiresOn) {
    extraInfo = (
      <span role="gridcell" className={`${styles.cell} ${styles.one}`}>
        <div className={styles.type}>{disclosureType}</div>
        <div className={styles.extra}>
          Expires On:
          <span style={{marginLeft: 3}}>
            {formatDate(expiresOn)}
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
    extraInfo = wrapWithUpdateLink(extraInfo, type);
  }
  else if (revisable) {
    extraInfo = wrapWithReviseLink(extraInfo, disclosureId);
  }
  else {
    extraInfo = wrapWithReadOnlyLink(extraInfo, disclosureId);
  }

  const disclosureStatus = getDisclosureStatusString(
    configState,
    status,
    configId
  );
  let statusColumn = (
    <span role="gridcell" className={`${styles.cell} ${styles.two}`}>
      {disclosureStatus}
    </span>
  );
  if (updateable) {
    statusColumn = wrapWithUpdateLink(statusColumn, type);
  }
  else if (revisable) {
    statusColumn = wrapWithReviseLink(statusColumn, disclosureId);
  }
  else {
    statusColumn = wrapWithReadOnlyLink(statusColumn, disclosureId);
  }

  let lastReviewed = (
    <span role="gridcell" className={`${styles.cell} ${styles.three}`}>
      {lastreviewed ? formatDate(lastreviewed) : 'None'}
    </span>
  );
  if (updateable) {
    lastReviewed = wrapWithUpdateLink(lastReviewed, type);
  }
  else if (revisable) {
    lastReviewed = wrapWithReviseLink(lastReviewed, disclosureId);
  }
  else {
    lastReviewed = wrapWithReadOnlyLink(lastReviewed, disclosureId);
  }

  let button;
  if (updateable) {
    button = wrapWithUpdateLink((
      <GreyButton className={styles.button}>Update &gt;</GreyButton>
    ), type);
  } else if (revisable) {
    button = wrapWithReviseLink((
      <GreyButton className={styles.button}>Revise &gt;</GreyButton>
    ), disclosureId);
  } else {
    button = wrapWithReadOnlyLink((
      <GreyButton className={styles.button}>View &gt;</GreyButton>
    ), disclosureId);
  }

  const buttonColumn = (
    <span role="gridcell" className={`${styles.cell} ${styles.four}`}>
      {button}
    </span>
  );

  const classes = classNames(
    styles.container,
    {[styles.annual]: type === 'Annual'},
    className
  );

  return (
    <div role="row" className={classes}>
      {extraInfo}
      {statusColumn}
      {lastReviewed}
      {buttonColumn}
    </div>
  );
}

DisclosureTableRow.contextTypes = {
  configState: React.PropTypes.object
};
