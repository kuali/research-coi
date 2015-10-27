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
        padding: '25px 30px',
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
        fontSize: 15,
        width: '50%',
        borderBottom: '1px solid #777',
        paddingBottom: 4
      }
    };

    let fileUploadStyles = {
      middle: {
        display: 'inline-block',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        width: '66%'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={{paddingBottom: 20}}>
          <span style={styles.close} onClick={this.done}>
            <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
          </span>
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
          multiple={true}
          styles={fileUploadStyles}
        >
          <div>Drag and drop or upload your management plan</div>
          <div style={{fontSize: 10, marginTop: 2}}>Acceptable Formats: .pdf, .png, .doc, .jpeg</div>
        </FileUpload>
      </div>
    );
  }
}
