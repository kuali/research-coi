import React from 'react/addons';
import Dropzone from 'react-dropzone';
import {merge} from '../merge';

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
      },
      deleteButton: {
        backgroundColor: 'white',
        color: '#666666',
        border: '1px Solid #DEDEDE',
        borderRadius: 7,
        width: 124,
        padding: 7,
        fontSize: 14,
        outline: 0,
        cursor: 'pointer'
      }
    };

    let styles = merge(defaultStyles, this.props.styles);

    let files;
    if (this.props.files) {
      files = this.props.files.map((file, index)=> {
        let downloadLink;

        if (file.preview) {
          downloadLink = (
            <a href={file.preview}>download</a>
          );
        } else if(file.key) {
          downloadLink = (
            <a href={'/api/coi/file/' + encodeURIComponent(file.key)}>download</a>
          );
        }

        let deleteButton;

        if (!this.props.readonly) {
          deleteButton = (
           <button onClick={this.onDelete} style={styles.deleteButton} value={index}>Delete File</button>
          );
        }

        return (
          <div value={index} key={'file_' + index} style={styles.file}>
            <div style={styles.left}>
              {downloadLink}
            </div>
            <div style={styles.middle}>
              <p>{this.props.fileType} Uploaded</p>
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

    let readOnly = (this.props.multiple === false && this.props.files.length > 0) || this.props.readonly;
    if (!readOnly) {
      dropzone = (
        <Dropzone
        onDrop={this.onDrop}
        accept='.pdf'
        style={styles.dropZone}
        activeStyle={styles.dropZoneActive}
        multiple={this.props.multiple}>
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
