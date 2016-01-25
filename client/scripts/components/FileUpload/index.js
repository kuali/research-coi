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
import Dropzone from 'react-dropzone';
import {GreyButton} from '../GreyButton';
import {BlueButton} from '../BlueButton';

export class FileUpload extends React.Component {
  constructor() {
    super();

    this.onDrop = this.onDrop.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onDrop(files) {
    this.props.onDrop(files);
  }

  onDelete(evt) {
    this.props.delete(evt.target.value);
  }

  render() {
    let files;
    if (this.props.files) {
      files = this.props.files.map((file, index) => {
        let downloadLink, downloadButton;

        if (file.preview) {
          downloadLink = (
            <a target="_blank" className={styles.link} href={file.preview}>
              {file.name}
            </a>
          );
          downloadButton = (
            <a target="_blank" className={styles.downloadButtonLink} href={file.preview}>
              <span>
                <BlueButton className={`${styles.override} ${styles.downloadButton}`}>DOWNLOAD</BlueButton>
              </span>
            </a>
          );
        } else if(file.key) {
          downloadLink = (
            <a className={styles.link} href={`/api/coi/files/${encodeURIComponent(file.id)}`}>
              {file.name}
            </a>
          );
          downloadButton = (
            <a className={styles.downloadButtonLink} href={`/api/coi/files/${encodeURIComponent(file.id)}`}>
              <span>
                <BlueButton className={`${styles.override} ${styles.downloadButton}`}>DOWNLOAD</BlueButton>
              </span>
            </a>
          );
        }

        let deleteButton;
        if (!this.props.readonly) {
          deleteButton = (
            <GreyButton onClick={this.onDelete} className={`${styles.override} ${styles.deleteButton}`} value={file.id}>DELETE FILE</GreyButton>
          );
        }

        return (
          <div value={index} key={`file_${index}`} className={styles.file}>
            {downloadLink}
            <span style={{float: 'right'}}>
              {downloadButton}
              {deleteButton}
            </span>
          </div>
        );
      });
    }

    let dropzone;

    const readOnly = (this.props.multiple === false && this.props.files.length > 0) || this.props.readonly;
    if (!readOnly) {
      dropzone = (
        <Dropzone
          onDrop={this.onDrop}
          className={`fd ${styles.dropZone}`}
          activeClassName={`file-drop ${styles.dropZoneActive}`}
          multiple={this.props.multiple}
        >
          <div className={`not-hovering`}>
            <span className={styles.left}>
              <i className={`fa fa-upload ${styles.icon}`}></i>
            </span>
            <span className={`${styles.middle} ${this.props.className}`}>
              {this.props.children}
            </span>
            <span className={styles.right}>
              <BlueButton className={`${styles.override} ${styles.button}`}>UPLOAD</BlueButton>
            </span>
          </div>
          <div className={`hovering`} style={{textAlign: 'center', height: 31}}>
            <i
              className={`fa fa-file-text`}
              style={{color: 'white', marginRight: 15, fontSize: 20}}
            ></i>
            <span style={{fontSize: 19}}>Drop Me Here!</span>
          </div>
        </Dropzone>
      );
    }

    return (
      <div>
        {dropzone}
        {files}
      </div>
    );
  }
}
