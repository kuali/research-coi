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
        padding: '25px 30px'
      },
      done: {
        float: 'right',
        fontSize: 14,
        marginTop: 5,
        cursor: 'pointer'
      },
      title: {
        fontSize: 22,
        fontWeight: 300
      },
      fileLink: {
        color: window.config.colors.three,
        borderBottom: '1px dotted' + window.config.colors.three
      }
    };

    let files = this.props.files.map(file=>{
      return (
        <div key={file.id} style={{marginBottom: 5}}>
          <a style={styles.fileLink} href={'/api/coi/file/' + encodeURIComponent(file.key)}>{file.name}</a>
        </div>
      );
    });
    return (
    <div style={merge(styles.container, this.props.style)}>
      <div style={{paddingBottom: 20, borderBottom: '1px solid #888'}}>
        <span style={styles.done} onClick={this.done}>Done</span>
        <span style={styles.title}>ATTACHMENTS</span>
      </div>
      {files}

    </div>
    );
  }
}
