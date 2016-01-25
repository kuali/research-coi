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
import {AdminActions} from '../../../../actions/AdminActions';

export default function GeneralAttachmentsPanel(props) {
  const files = props.files.map(file => {
    return (
      <div key={file.id} style={{marginBottom: 5}}>
        <a className={styles.fileLink} href={`/api/coi/files/${encodeURIComponent(file.id)}`}>{file.name}</a>
      </div>
    );
  });

  return (
    <div className={classNames(styles.container, props.className)}>
      <div className={styles.heading}>
        <span className={styles.close} onClick={AdminActions.hideGeneralAttachmentsPanel}>
          <i className={`fa fa-times`} style={{fontSize: 23}}></i> CLOSE
        </span>
        <span className={styles.title}>ATTACHMENTS</span>
      </div>
      <div className={styles.files}>
        {files}
      </div>
    </div>
  );
}
