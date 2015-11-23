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
import {merge} from '../../merge';
import {DisclosureActions} from '../../actions/DisclosureActions';

export function DisclosureHeader(props: Object): React.Element {
  let styles = {
    container: {
      backgroundColor: 'white',
      padding: '17px 0 17px 50px',
      position: 'relative',
      boxShadow: '0 2px 8px #D5D5D5',
      zIndex: 2
    },
    instructionButton: {
      top: 0,
      position: 'absolute',
      right: '25%',
      color: window.colorBlindModeOn ? 'black' : '#0095A0',
      fontSize: 18,
      cursor: 'pointer',
      marginTop: 0,
      padding: '29px 14px',
      height: '100%'
    },
    heading: {
      fontSize: '33px',
      margin: '0 0 0 0',
      'textTransform': 'uppercase',
      fontWeight: 300,
      color: '#444'
    }
  };

  return (
    <div style={merge(styles.container, props.style)}>
      <span style={styles.instructionButton} onClick={DisclosureActions.toggleInstructions}>
        <i className="fa fa-info-circle" style={{marginRight: 5, fontSize: 20}}></i>
        Instructions
      </span>
      <h2 style={styles.heading}>
        {props.children}
      </h2>
    </div>
  );
}
