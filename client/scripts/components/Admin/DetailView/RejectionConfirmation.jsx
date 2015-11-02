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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class RejectionConfirmation extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  reject() {
    AdminActions.rejectDisclosure();
  }

  cancel() {
    AdminActions.toggleRejectionConfirmation();
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        color: 'black',
        fontSize: 15,
        width: 235,
        backgroundColor: 'white',
        padding: '20px 24px',
        boxShadow: '0 0 10px 2px #CCC'
      },
      button: {
        margin: '0 auto',
        display: 'block',
        marginBottom: 10,
        padding: '5px 10px',
        borderBottom: '2px solid #717171',
        width: 135,
        backgroundColor: window.colorBlindModeOn ? 'white' : '#DFDFDF'
      },
      yesButton: {
        margin: '0 auto',
        display: 'block',
        marginBottom: 10,
        padding: '5px 10px',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#00BCD4',
        color: 'white',
        borderBottom: '2px solid #717171',
        width: 135,
        fontWeight: 300,
        textShadow: '1px 1px 6px #777'
      },
      generalComments: {
        fontSize: 12,
        marginBottom: 3
      },
      commentText: {
        display: 'block',
        width: '100%',
        height: 200,
        marginBottom: 30,
        resize: 'none',
        borderRadius: 5,
        border: '1px solid #AAA',
        padding: 7,
        fontSize: 14
      },
      question: {
        paddingBottom: 17,
        borderBottom: '1px solid #AAA',
        marginBottom: 17
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);
    let rejectionSection;
    if (this.props.canReject) {
      rejectionSection = (
        <div style={merge(styles.container, this.props.style)} >
          <div style={styles.question}>
            Are you sure you want to send this disclosure back for further review?
          </div>

          <div style={styles.generalComments}>NOTIFICATION TO USER</div>
          <textarea ref="comments" style={styles.commentText} />

          <KButton onClick={this.reject} style={styles.yesButton}>YES, SUBMIT</KButton>
          <KButton onClick={this.cancel} style={styles.button}>NO, CANCEL</KButton>
        </div>
      );
    } else {
      rejectionSection = (
        <div style={merge(styles.container, this.props.style)} >
          <div style={styles.question}>
            Please add one or more comments visible to the PI before sending back a disclosure.
          </div>

          <KButton onClick={this.cancel} style={styles.button}>CLOSE</KButton>
        </div>
      );
    }
    return (
      <div>
        {rejectionSection}
      </div>
    );
  }
}
