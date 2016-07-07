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
import {getDispositionTypeString} from '../../stores/config-store';
import getConfig from '../../get-config';

export default function DeclarationSummary(props, {configState}) {
  const config = getConfig(configState, props.configId);
  if (config === null) {
    return null;
  }

  let adminRelationship;
  let commentClass = styles.comments;
  if (config.general.adminRelationshipEnabled && props.showDispositions) {
    const dispositionType = getDispositionTypeString(
      configState,
      props.declaration.adminRelationshipCd,
      props.configId
    );
    adminRelationship = (
      <span className={styles.adminRelationship}>
        {dispositionType}
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

DeclarationSummary.contextTypes = {
  configState: React.PropTypes.object
};
