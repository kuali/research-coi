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
import {DisclosureActions} from '../../../actions/disclosure-actions';

export function DisclosureHeader(props) {
  return (
    <div className={`${styles.container} ${props.className}`}>
      <span
        className={styles.instructionButton}
        onClick={DisclosureActions.toggleInstructions}
      >
        <i className={'fa fa-info-circle'} style={{marginRight: 5, fontSize: 20}} />
        Instructions
      </span>
      <h2 className={styles.heading}>
        {props.children}
      </h2>
    </div>
  );
}
