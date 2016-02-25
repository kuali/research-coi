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
import ConfigStore from '../../../../stores/config-store';
import {COIConstants} from '../../../../../../coi-constants';
import {Link} from 'react-router';

export function TravelLogButton(props) {
  return (
    <Link to={`/coi/travelLog`} className={`${styles.container} ${props.className}`}>
      <div>
        <span>
          <div className={styles.primary}>Update</div>
          <div className={styles.secondary}>{ConfigStore.getDisclosureTypeString(COIConstants.DISCLOSURE_TYPE.TRAVEL)}</div>
        </span>
      </div>
    </Link>
  );
}
