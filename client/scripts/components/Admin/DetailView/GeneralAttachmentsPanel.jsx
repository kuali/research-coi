import React from 'react/addons';
import {merge} from '../../../merge';
import {AdminActions} from '../../../actions/AdminActions';

export default class AdditionalReviewPanel extends React.Component {
  constructor() {
    super();
  }

  done() {
    AdminActions.hideGeneralAttachmentsPanel();
  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        height: '100%',
        boxShadow: '0 0 10px 0 #AAA'
      },
      close: {
        float: 'right',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: 8,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 20
      },
      title: {
        fontSize: 22,
        fontWeight: 300,
        borderBottom: '1px solid #888'
      },
      fileLink: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        borderBottom: '1px dotted ' + (window.colorBlindModeOn ? 'black' : '#0095A0')
      },
      heading: {
        color: 'black',
        padding: '18px 20px 10px 20px',
        marginBottom: 20
      },
      files: {
        padding: '0 20px'
      }
    };

    let files = this.props.files.map(file=>{
      return (
        <div key={file.id} style={{marginBottom: 5}}>
          <a style={styles.fileLink} href={'/api/coi/files/' + encodeURIComponent(file.id)}>{file.name}</a>
        </div>
      );
    });
    return (
    <div style={merge(styles.container, this.props.style)}>
      <div style={styles.heading}>
        <span style={styles.close} onClick={this.done}>
          <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
        </span>
        <span style={styles.title}>ATTACHMENTS</span>
      </div>
      <div style={styles.files}>
        {files}
      </div>

    </div>
    );
  }
}
