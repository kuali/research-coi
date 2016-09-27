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
import SortArrow from '../sort-arrow';

export function TableHeading(props) {
  const sortArrow = <SortArrow direction={props.sortDirection} />;

  return (
    <span
      className={classNames(props.className, styles.container)}
      role="columnheader"
      onClick={props.sort}
    >
      <span className={styles.label}>{props.children}</span>
      {props.active ? sortArrow : <span />}
    </span>
  );
}
