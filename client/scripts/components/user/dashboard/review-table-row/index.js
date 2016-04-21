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
import {formatDate} from '../../../../format-date';
import {Link} from 'react-router';

export function ReviewTableRow({assignDate, reporter, type, id}) {
  return (
    <div role="row" className={styles.container}>
      <Link
        style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}}
        to={`/coi/revise/${id}`}
      >
        <span role="gridcell" className={`${styles.cell} ${styles.one}`}>
          {reporter}
        </span>
        <span role="gridcell" className={`${styles.cell} ${styles.two}`}>
          {type}
        </span>
        <span role="gridcell" className={`${styles.cell} ${styles.three}`}>
          {assignDate ? formatDate(assignDate) : null}
        </span>
        <span role="gridcell" className={`${styles.cell} ${styles.four}`}>
          <GreyButton>Review &gt;</GreyButton>
        </span>
      </Link>
    </div>
  );
}
