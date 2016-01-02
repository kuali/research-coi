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

export default function CheckLink(props) {
  const check = (
    <i className={`fa fa-check ${styles.checkmark}`}></i>
  );

  const classes = classNames(
    {[styles.checked]: props.checked},
    {[styles.disabled]: props.disabled},
    styles.container,
    props.className
  );

  return (
    <span className={classes} onClick={props.onClick}>
      {check}
      <span className={styles.link}>
        {props.children}
      </span>
    </span>
  );
}
