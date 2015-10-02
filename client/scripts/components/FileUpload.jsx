import React from 'react/addons';
import {ProminentButton} from './ProminentButton';
import Dropzone from 'react-dropzone';

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
    let styles = {
      dropZone: {
        width: '100%',
        display: 'inline-block',
        border: '3px dashed grey',
        marginTop: 10
      },
      dropZoneActive: {
        width: '100%',
        display: 'inline-block',
        border: '3px dashed blue',
        marginTop: 10
      },
      left: {
        width: '20%',
        display: 'inline-block'
      },
      middle: {
        width: '60%',
        display: 'inline-block',
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      right: {
        width: '20%',
        display: 'inline-block'
      },
      file: {
        width: '100%',
        display: 'inline-block',
        border: '3px solid grey',
        marginTop: 10
      }
    };

    let files;
    if (this.props.files) {
      files = this.props.files.map((file, index)=> {
        let downloadLink;

        if (file.preview) {
          downloadLink = (
            <a href={file.preview}>download</a>
          );
        } else if(file.path) {
          downloadLink = (
            <a href={'/api/coi/file/' + encodeURIComponent(file.path)}>download</a>
          );
        }

        let deleteButton;

        if (!this.props.readonly) {
          deleteButton = (
           <ProminentButton onClick={this.onDelete} value={index}>Delete File</ProminentButton>
          );
        }

        return (
          <div value={index} style={styles.file}>
            <div style={styles.left}>
              {downloadLink}
            </div>
            <div style={styles.middle}>
              <p>Attachment Uploaded</p>
              <p>File Name: {file.name}</p>
            </div>
            <div style={styles.right}>
              {deleteButton}
            </div>
          </div>
        );
      });
    }

    let dropzone;

    if (!this.props.readonly) {
      dropzone = (
        <Dropzone
        onDrop={this.onDrop}
        accept='.pdf'
        style={styles.dropZone}
        activeStyle={styles.dropZoneActive} >
          <div style={styles.left}>
            {/*icon goes here*/}
          </div>
          <div style={styles.middle}>
            {this.props.children}
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
