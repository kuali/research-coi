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
import React from 'react';

export function Flag(props) {
  let text;
  let extraClass;
  switch (props.type) {
    case 'NONE':
      text = 'NO CONFLICT';
      extraClass = styles.noConflict;
      break;
    case 'POTENTIAL':
      text = 'POTENTIAL RELATIONSHIP';
      extraClass = styles.potential;
      break;
    case 'MANAGED':
      text = 'MANAGED RELATIONSHIP';
      extraClass = styles.managed;
      break;
    case 'ATTENTION':
      text = 'ATTENTION REQUIRED';
      extraClass = styles.attention;
      break;
  }

  return (
    <span className={`${styles.container} ${props.className} ${extraClass}`}>
      {text}
    </span>
  );
}
