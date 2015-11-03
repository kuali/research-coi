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

import React from 'react/addons';
import Dropzone from 'react-dropzone';
import {merge} from '../merge';
import {KButton} from './KButton';

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
    let defaultStyles = {
      dropZone: {
        border: '3px dashed grey',
        margin: 25,
        borderRadius: 5,
        padding: 20
      },
      dropZoneActive: {
        backgroundColor: '#0095A0',
        margin: 25,
        borderRadius: 5,
        padding: 23,
        color: 'white',
        border: 0
      },
      left: {
        width: '12%',
        display: 'inline-block'
      },
      middle: {
        width: '66%',
        display: 'inline-block',
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      right: {
        width: '22%',
        display: 'inline-block'
      },
      file: {
        backgroundColor: '#EEEEEE',
        margin: '10px 28px 0 28px',
        borderRadius: 5,
        padding: '10px 19px 15px 19px'
      },
      icon: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 25
      },
      button: {
        padding: 3,
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        color: 'white',
        borderBottom: '2px solid #717171',
        width: 90,
        fontWeight: 300,
        textShadow: '1px 1px 6px #777',
        fontSize: 11
      },
      downloadButton: {
        padding: 1,
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        color: 'white',
        borderBottom: '2px solid #717171',
        width: 90,
        fontWeight: 300,
        textShadow: '1px 1px 6px #777',
        fontSize: 10,
        marginRight: 7
      },
      deleteButton: {
        padding: 1,
        backgroundColor: window.colorBlindModeOn ? 'white' : '#DFDFDF',
        color: 'black',
        borderBottom: '2px solid #717171',
        width: 90,
        fontWeight: 300,
        fontSize: 10
      },
      link: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        borderBottom: window.colorBlindModeOn ? '2px dashed black' : '2px dashed #0095A0',
        fontSize: 17
      },
      downloadButtonLink: {
        color: '#0095A0',
        fontSize: 17
      }
    };

    let styles = merge(defaultStyles, this.props.styles);

    let files;
    if (this.props.files) {
      files = this.props.files.map((file, index)=> {
        let downloadLink, downloadButton;

        if (file.preview) {
          downloadLink = (
            <a target="_blank" style={styles.link} href={file.preview}>
              {file.name}
            </a>
          );
          downloadButton = (
            <a target="_blank" style={styles.downloadButtonLink} href={file.preview}>
              <span>
                <KButton style={styles.downloadButton}>DOWNLOAD</KButton>
              </span>
            </a>
          );
        } else if(file.key) {
          downloadLink = (
            <a style={styles.link} href={'/api/coi/files/' + encodeURIComponent(file.id)}>
              {file.name}
            </a>
          );
          downloadButton = (
            <a style={styles.downloadButtonLink} href={'/api/coi/files/' + encodeURIComponent(file.id)}>
              <span>
                <KButton style={styles.downloadButton}>DOWNLOAD</KButton>
              </span>
            </a>
          );
        }

        let deleteButton;
        if (!this.props.readonly) {
          deleteButton = (
            <KButton onClick={this.onDelete} style={styles.deleteButton} value={index}>Delete File</KButton>
          );
        }

        return (
          <div value={index} key={'file_' + index} style={styles.file}>
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

    let readOnly = (this.props.multiple === false && this.props.files.length > 0) || this.props.readonly;
    if (!readOnly) {
      dropzone = (
        <Dropzone
          onDrop={this.onDrop}
          style={styles.dropZone}
          className="fd"
          activeClassName="file-drop"
          activeStyle={styles.dropZoneActive}
          multiple={this.props.multiple}
        >
          <div className="not-hovering">
            <span style={styles.left}>
              <i className="fa fa-upload" style={styles.icon}></i>
            </span>
            <span style={styles.middle}>
              {this.props.children}
            </span>
            <span style={styles.right}>
              <KButton style={styles.button}>UPLOAD</KButton>
            </span>
          </div>
          <div className="hovering" style={{textAlign: 'center', height: 31}}>
            <i className="fa fa-file-text" style={{color: 'white', marginRight: 15, fontSize: 20}}></i>
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
