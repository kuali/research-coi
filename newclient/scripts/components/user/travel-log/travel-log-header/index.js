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
import {getDisclosureTypeString} from '../../../../stores/config-store';
import { DISCLOSURE_TYPE } from '../../../../../../coi-constants';

export function TravelLogHeader(props, {configState}) {
  const disclosureType = getDisclosureTypeString(
    configState,
    DISCLOSURE_TYPE.TRAVEL,
    configState.config.id
  );

  return (
    <div className={`${styles.container} ${props.className}`}>
      <h2 className={styles.heading}>
        {disclosureType}
      </h2>
    </div>
  );
}

TravelLogHeader.contextTypes = {
  configState: React.PropTypes.object
};
