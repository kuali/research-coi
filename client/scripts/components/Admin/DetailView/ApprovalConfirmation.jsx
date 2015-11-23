/* @flow */
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
import {GreyButton} from '../../GreyButton';
import {BlueButton} from '../../BlueButton';
import {AdminActions} from '../../../actions/AdminActions';

export default function ApprovalConfirmation(props: Object): React.Element {
  let styles = {
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
      backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
      color: 'white',
      borderBottom: '2px solid #717171',
      width: 135,
      fontWeight: 300,
      textShadow: '1px 1px 6px #777'
    },
    question: {
      marginBottom: 30
    }
  };

  return (
    <div style={merge(styles.container, props.style)} >
      <div style={styles.question}>
        Are you sure you want to approve this disclosure?
      </div>

      <BlueButton onClick={AdminActions.approveDisclosure} style={styles.yesButton}>YES, CONFIRM</BlueButton>
      <GreyButton onClick={AdminActions.toggleApprovalConfirmation} style={styles.button}>NO, CANCEL</GreyButton>
    </div>
  );
}
