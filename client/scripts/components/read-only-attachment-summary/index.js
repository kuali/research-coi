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
import {FILE_TYPE} from '../../../../coi-constants';

function getFileType(fileType) {
  switch (fileType) {
    case FILE_TYPE.ADMIN: return 'Admin';
    case FILE_TYPE.DISCLOSURE: return 'Disclosure';
    case FILE_TYPE.FINANCIAL_ENTITY: return 'Financial Entity';
    case FILE_TYPE.MANAGEMENT_PLAN: return 'Management Plan';
    default: return '';
  }
}

export default function ReadOnlyAttachmentSummary({className, files}) {
  let filesJsx = (
    <div>None</div>
  );

  if (files && files.length > 0) {
    filesJsx = files.map(file => {
      return (
        <div key={file.key} className={styles.file}>
          <a href={`/api/coi/files/${file.id}`} className={styles.link}>
            {file.name}
          </a>
          <span className={styles.type}>
            (Type:
            <span style={{marginLeft: 3}}>{getFileType(file.fileType)}</span>
            )
          </span>
        </div>
      );
    });
  }

  return (
    <div className={classNames(styles.container, className)} >
      <div className={styles.heading}>ATTACHMENTS</div>
      <div className={styles.body}>
        {filesJsx}
      </div>
    </div>
  );
}
