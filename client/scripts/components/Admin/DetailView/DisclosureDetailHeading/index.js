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
import ConfigStore from '../../../../stores/ConfigStore';
import {formatDate, formatDateTime} from '../../../../formatDate';
import {DISCLOSURE_STATUS} from '../../../../../../COIConstants';

export function DisclosureDetailHeading(props) {
  const disclosure = props.disclosure;

  let submittedDate;
  if (disclosure.revisedDate) {
    submittedDate = (
      <div className={styles.details}>
        <span className={styles.label}>Revised On:</span>
        <span className={styles.value}>
          <span style={{marginRight: 3}}>{formatDate(disclosure.revisedDate)}</span>
          <span style={{marginRight: 3}}>•</span>
          {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}
        </span>
      </div>
    );
  }
  else {
    submittedDate = (
      <div className={styles.details}>
        <span className={styles.label}>Submitted On:</span>
        <span className={styles.value}>
          <span style={{marginRight: 3}}>{formatDate(disclosure.submittedDate)}</span>
          <span style={{marginRight: 3}}>•</span>
          {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}
        </span>
      </div>
    );
  }

  let approvedDate;
  if (
    disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE &&
    disclosure.lastReviewDate
  ) {
    approvedDate = (
      <div className={styles.details}>
        <span className={styles.label}>Approved On:</span>
        <span className={styles.value}>{formatDateTime(disclosure.lastReviewDate)}</span>
      </div>
    );
  }

  return (
    <div className={classNames(styles.container, props.className)} >
      <span>
        <div className={styles.heading}>
          <span className={styles.disclosure}>
            <span style={{marginRight: 3}}>
              {ConfigStore.getDisclosureTypeString(disclosure.typeCd)}
            </span>
            •
          </span>
          <span>ID</span>
          <span className={styles.id}>#{disclosure.id}</span>
        </div>
        <div className={styles.details}>
          <span className={styles.label}>Submitted By:</span>
          <span className={styles.value}>{disclosure.submittedBy}</span>
        </div>
        {submittedDate}
        {approvedDate}
      </span>
    </div>
  );
}
