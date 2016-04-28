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
import ConfigStore from '../../../../stores/config-store';
import { LANES } from '../../../../../../coi-constants';

export default function DeclarationSummary(props) {

  let adminRelationship;
  let commentClass = styles.comments;
  if (props.config.lane === LANES.TEST && props.config.general.adminRelationshipEnabled) {
    adminRelationship = (
      <span className={styles.adminRelationship}>
        {ConfigStore.getDispositionTypeString(props.declaration.adminRelationshipCd)}
      </span>
    );
    commentClass = classNames(styles.comments, styles.shortComment);
  }

  return (
    <div className={classNames(styles.container, props.className)}>
      <div>
        <span className={styles.entityName} style={{fontWeight: 'bold'}}>
          {props.declaration.entityName}
        </span>
        <span className={styles.conflict} style={{fontWeight: 'bold'}}>
          {props.disposition}
        </span>
        {adminRelationship}
        <span className={commentClass} style={{fontStyle: 'italic'}}>
          {props.declaration.comments}
        </span>
      </div>
    </div>
  );
}
