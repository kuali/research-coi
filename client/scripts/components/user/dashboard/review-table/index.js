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
import {ReviewTableRow} from '../review-table-row';
import {getDisclosureTypeString} from '../../../../stores/config-store';
import { DATE_TYPE } from '../../../../../../coi-constants';

export function ReviewTable({disclosures}, {configState}) {
  let rows;
  if (Array.isArray(disclosures) && disclosures.length > 0) {
    rows = disclosures.map(disclosure => {
      let assignedDate;
      if (disclosure.dates) {
        const dates = JSON.parse(disclosure.dates);
        assignedDate = dates.find(date => date.type === DATE_TYPE.ASSIGNED);
      }
      const disclosureType = getDisclosureTypeString(
        configState,
        disclosure.typeCd,
        disclosure.configId
      );
      return (
        <ReviewTableRow
          key={disclosure.id}
          reporter={disclosure.name}
          type={disclosureType}
          assignDate={assignedDate.date}
          id={disclosure.id}
          statusCd={disclosure.statusCd}
        />
      );
    });
  } else {
    rows = (
      <div role="row" className={styles.noRows}>
        You don&rsquo;t have any reviews assigned at this time.
      </div>
    );
  }

  return (
    <div role="grid" className={styles.container}>
      <div role="row" className={styles.headings}>
        <span role="columnheader" className={`${styles.heading} ${styles.columnOne}`}>
          REPORTER NAME
        </span>
        <span role="columnheader" className={`${styles.heading} ${styles.columnTwo}`}>
          DISCLOSURE TYPE
        </span>
        <span role="columnheader" className={`${styles.heading} ${styles.columnThree}`}>
          REVIEW ASSIGNED
        </span>
      </div>
      {rows}
    </div>
  );
}

ReviewTable.contextTypes = {
  configState: React.PropTypes.object
};
