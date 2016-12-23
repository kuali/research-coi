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
import DisclosureType from '../disclosure-type';
import {DISCLOSURE_TYPE} from '../../../../../../coi-constants';

export default function DisclosureTypes(props) {
  let rows;
  if (props.types && props.types.length > 0) {
    const annual = props.types.find(t => t.typeCd == DISCLOSURE_TYPE.ANNUAL);
    const travel = props.types.find(t => t.typeCd == DISCLOSURE_TYPE.TRAVEL);

    rows = (
      <div>
        <div className={classNames(styles.optionRow, 'flexbox', 'row')}>
          <DisclosureType type={annual} canToggle={true} />
          <DisclosureType type={travel} canToggle={true} />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.container, props.className)}>
      <div className={styles.title}>DISCLOSURE TITLE</div>
      {rows}
    </div>
  );
}
