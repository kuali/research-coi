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
import {formatDate} from '../../../../format-date';
import {getDisclosureTypeString} from '../../../../stores/config-store';

export default function RevisionHeader(props, {configState}) {
  const disclosureType = getDisclosureTypeString(
    configState,
    props.disclosureType,
    configState.config.id
  );
  return (
    <div className={`${styles.container} ${props.className}`}>
      <span className={styles.disclosureType}>
        {disclosureType.toUpperCase()}
      </span>
      <span className={styles.dates}>
        <div>
          Submitted on
          <span style={{marginLeft: 3}}>
            {formatDate(props.submittedDate)}
          </span>
        </div>
        <div>
          Returned for Revisions on
          <span style={{marginLeft: 3}}>
            {formatDate(props.returnedDate)}
          </span>
        </div>
      </span>
    </div>
  );
}

RevisionHeader.contextTypes = {
  configState: React.PropTypes.object
};
