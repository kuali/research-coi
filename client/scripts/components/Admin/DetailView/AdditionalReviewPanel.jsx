import React from 'react/addons';
import {merge} from '../../../merge';
import {AdminActions} from '../../../actions/AdminActions';
import {FileUpload} from '../../FileUpload';

export default class AdditionalReviewPanel extends React.Component {
  constructor() {
    super();

    this.addManagementPlan = this.addManagementPlan.bind(this);
    this.deleteManagementPlan = this.deleteManagementPlan.bind(this);
  }

  done() {
    AdminActions.hideAdditionalReviewPanel();
  }

  addManagementPlan(files) {
    AdminActions.addManagementPlan(files);
  }

  deleteManagementPlan() {
    AdminActions.deleteManagementPlan();
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
      download: {
        float: 'right',
        border: 0,
        backgroundColor: '#333',
        color: 'white',
        padding: '5px 10px'
      },
      dragAndDrop: {
        margin: '25px 0',
        border: '3px dashed #888',
        padding: '10px 15px',
        borderRadius: 4
      },
      complete: {
        paddingBottom: 15,
        fontSize: 14,
        verticalAlign: 'middle'
      },
      additionalReviewerLabel: {
        borderTop: '1px solid #BBB',
        paddingTop: 25
      },
      searchLabel: {
        margin: '15px 0 5px 0',
        fontSize: 12,
        color: '#666'
      },
      searchBox: {
        width: '100%',
        border: '1px solid #999',
        padding: '10px 15px'
      },
      title: {
        fontSize: 22,
        fontWeight: 300
      },
      subLabel: {
        fontSize: 14
      }
    };

    let fileUploadStyles = {
      deleteButton: {
        width: 90,
        fontSize: 12
      },
      middle: {
        width: '60%',
        display: 'inline-block',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: 12
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={{paddingBottom: 20, borderBottom: '1px solid #888'}}>
          <span style={styles.done} onClick={this.done}>Done</span>
          <span style={styles.title}>ADDITIONAL REVIEW</span>
        </div>
        <div style={{paddingTop: 12}}>
          <span style={styles.subLabel}>MANAGEMENT PLAN</span>
        </div>


        <FileUpload
          fileType='Management Plan'
          readonly={this.props.readonly}
          onDrop={this.addManagementPlan}
          delete={this.deleteManagementPlan}
          files={this.props.managementPlan}
          multiple={false}
          styles={fileUploadStyles}>
          <p>Drag and Drop or Click to upload your attachments</p>
          <p>Acceptable Formats: .pdf, .png, .doc, .jpeg</p>
        </FileUpload>
      </div>
    );
  }
}
