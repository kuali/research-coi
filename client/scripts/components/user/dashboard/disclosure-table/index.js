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
import DisclosureTableRow from '../disclosure-table-row';

export default function DisclosureTable({disclosures, className}) {
  const rows = disclosures ? disclosures.map((disclosure, index) => {
    return (
      <DisclosureTableRow
        type={disclosure.type}
        status={disclosure.status}
        lastreviewed={disclosure.last_review_date}
        title={disclosure.title}
        expiresOn={disclosure.expired_date}
        key={index}
        disclosureId={disclosure.id}
        configId={disclosure.configId}
      />
    );
  }) : null;

  const classes = classNames(
    styles.container,
    className
  );

  return (
    <div role="grid" className={classes}>
      <div role="row" className={styles.headings}>
        <span
          role="columnheader"
          className={`${styles.heading} ${styles.columnOne}`}
        >
          DISCLOSURE TYPE
        </span>
        <span
          role="columnheader"
          className={`${styles.heading} ${styles.columnTwo}`}
        >
          STATUS
        </span>
        <span
          role="columnheader"
          className={`${styles.heading} ${styles.columnThree}`}
        >
          LAST REVIEW
        </span>
      </div>
      {rows}
    </div>
  );
}
