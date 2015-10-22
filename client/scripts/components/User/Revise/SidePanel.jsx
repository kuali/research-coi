import React from 'react/addons';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import Router from 'react-router';
let Link = Router.Link;
import PIReviewActions from '../../../actions/PIReviewActions';

export default class SidePanel extends React.Component {
  constructor() {
    super();

    this.state = {
      agreed: false
    };

    this.onAgreeChange = this.onAgreeChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  onAgreeChange(evt) {
    this.setState({
      agreed: evt.target.checked
    });
  }

  confirm() {
    if (this.state.agreed) {
      this.props.onConfirm();
    }
  }

  submit() {
    PIReviewActions.submit();
  }

  render() {
    let submitEnabled = this.props.submitEnabled;

    let styles = {
      container: {
        width: 220
      },
      message: {
        margin: '25px 28px 25px 3px',
        paddingBottom: 18,
        borderBottom: '1px solid #AAA'
      },
      submit: {
        color: submitEnabled ? '#333' : '#CCC',
        cursor: submitEnabled ? 'pointer' : 'default',
        verticalAlign: 'middle',
        fontSize: 18
      },
      cancel: {
        cursor: 'pointer',
        verticalAlign: 'middle',
        fontSize: 18
      },
      submitIcon: {
        color: submitEnabled ? window.colorBlindModeOn ? 'black' : '#F57C00' : '#CCC',
        fontSize: 35,
        verticalAlign: 'middle',
        margin: '0 10px 5px 15px'
      },
      cancelIcon: {
        color: window.colorBlindModeOn ? 'black' : '#F57C00',
        fontSize: 35,
        verticalAlign: 'middle',
        margin: '0 10px 0 15px'
      },
      certificationPane: {
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        color: 'white',
        padding: '25px 15px'
      },
      certCheckbox: {
        paddingTop: 17,
        textAlign: 'center',
        fontSize: 19
      },
      agreedLabel: {
        paddingLeft: 5
      },
      confirmButton: {
        fontSize: 20,
        color: this.state.agreed ? 'black' : '#AAA',
        cursor: this.state.agreed ? 'pointer' : 'default'
      },
      confirmSection: {
        textAlign: 'center',
        paddingTop: 35
      }
    };

    let content;
    if (this.props.showingCertification) {
      content = (
        <div style={styles.certificationPane}>
          <div>{this.props.certificationText}</div>
          <div style={styles.certCheckbox}>
            <input type="checkbox" id="certCheck" onChange={this.onAgreeChange} />
            <label style={styles.agreedLabel} htmlFor="certCheck">Agreed</label>
          </div>
          <div style={styles.confirmSection}>
            <KButton onClick={this.confirm} style={styles.confirmButton}>Confirm</KButton>
          </div>
        </div>
      );
    }
    else {
      let message;
      if (submitEnabled) {
        message = 'Yeah, you did it!  You addressed all the review comments.  Now just submit to send back for approval.';
      }
      else {
        message = 'Please either revise or respond to each section before resubmitting.';
      }
      content = (
        <div>
          <div style={styles.message}>{message}</div>
          <div style={styles.submit} onClick={this.submit}>
            <i className="fa fa-arrow-circle-right" style={styles.submitIcon}></i>
            SUBMIT
          </div>

          <Link to="dashboard">
            <div style={styles.cancel}>
              <i className="fa fa-times-circle" style={styles.cancelIcon}></i>
              CANCEL
            </div>
          </Link>
        </div>
      );
    }
    return (
      <span style={merge(styles.container, this.props.style)}>
        {content}
      </span>
    );
  }
}
