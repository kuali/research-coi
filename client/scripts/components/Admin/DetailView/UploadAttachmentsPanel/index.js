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
import {AdminActions} from '../../../../actions/AdminActions';
import {FileUpload} from '../../../FileUpload';
import classNames from 'classnames';

export default function UploadAttachmentsPanel(props) {
  return (
    <div name='Upload Attachments Panel' className={classNames(styles.container, props.className)}>
      <div className={styles.header}>
        <span className={styles.close} onClick={AdminActions.hideUploadAttachmentsPanel}>
          <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
        </span>
        <span className={styles.title}>UPLOAD ATTACHMENTS</span>
      </div>
      <FileUpload
        fileType='Admin'
        readonly={props.readonly}
        onDrop={AdminActions.addAdminAttachment}
        delete={AdminActions.deleteAdminAttachment}
        files={props.files}
        multiple={true}
        className={`${styles.override} ${styles.fileUploadStyles}`}
      >
        <div>Drag and drop or upload your management plan</div>
        <div style={{fontSize: 10, marginTop: 2}}>Acceptable Formats: .pdf, .png, .doc, .jpeg</div>
      </FileUpload>
    </div>
  );
}
