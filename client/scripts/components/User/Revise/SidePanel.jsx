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

import React from 'react';
import {merge} from '../../../merge';
import {BlueButton} from '../../BlueButton';
import {Link} from 'react-router';
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

  render() {
    const submitEnabled = this.props.submitEnabled;

    const styles = {
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
        fontSize: 29,
        verticalAlign: 'middle',
        margin: '0 10px 5px 15px'
      },
      cancelIcon: {
        color: window.colorBlindModeOn ? 'black' : '#F57C00',
        fontSize: 29,
        verticalAlign: 'middle',
        margin: '0 10px 0 15px'
      },
      certificationPane: {
        backgroundColor: 'white',
        color: 'black',
        padding: '25px 15px',
        boxShadow: '0 0 10px 2px #DDD'
      },
      certCheckbox: {
        paddingTop: 17,
        textAlign: 'center'
      },
      agreedLabel: {
        paddingLeft: 5
      },
      disabledConfirmButton: {
        cursor: 'default',
        color: '#AAA',
        backgroundColor: '#EEE',
        borderBottom: '2px solid #AAA',
        textShadow: 'inherit'
      },
      confirmSection: {
        textAlign: 'center',
        paddingTop: 35
      }
    };

    let content;
    if (this.props.showingCertification) {
      let confirmButtonStyle = {};
      if (!this.state.agreed) {
        confirmButtonStyle = styles.disabledConfirmButton;
      }

      content = (
        <div style={styles.certificationPane}>
          <div>{this.props.certificationText}</div>
          <div style={styles.certCheckbox}>
            <input type="checkbox" id="certCheck" onChange={this.onAgreeChange} />
            <label style={styles.agreedLabel} htmlFor="certCheck">Agreed</label>
          </div>
          <div style={styles.confirmSection}>
            <BlueButton onClick={this.confirm} style={confirmButtonStyle}>Confirm</BlueButton>
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
          <div style={styles.submit} onClick={PIReviewActions.submit}>
            <i className="fa fa-arrow-circle-right" style={styles.submitIcon}></i>
            SUBMIT
          </div>

          <Link to={`/`}>
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
