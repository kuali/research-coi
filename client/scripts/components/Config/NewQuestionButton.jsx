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
import {PlusIcon} from '../DynamicIcons/PlusIcon';

export default function NewQuestionButton(props: Object): React.Element {
  let styles = {
    container: {
      display: 'inline-block',
      width: 145,
      height: 145,
      backgroundColor: 'white',
      color: 'white',
      padding: '10px',
      fontSize: 23,
      position: 'relative',
      cursor: 'pointer',
      boxShadow: '0 0 10px #BBB',
      borderRadius: 6,
      marginBottom: 10
    },
    plus: {
      position: 'absolute',
      display: 'block',
      fontSize: 32,
      top: 10,
      right: 12,
      color: 'black'
    },
    newText: {
      color: window.colorBlindModeOn ? 'black' : '#535353',
      fontWeight: 400
    },
    questionText: {
      color: window.colorBlindModeOn ? 'black' : '#0095A0',
      fontWeight: 'bold'
    },
    img: {
      height: 42,
      width: 42,
      color: window.colorBlindModeOn ? 'black' : '#0095A0'
    },
    text: {
      verticalAlign: 'middle',
      marginTop: 67
    }
  };

  return (
    <span onClick={props.onClick} style={merge(styles.container, props.style)}>
      <div style={styles.text}>
        <div style={styles.newText}>New</div>
        <div style={styles.questionText}>Question</div>
      </div>
      <span style={styles.plus}>
        <PlusIcon style={styles.img} />
      </span>
    </span>
  );
}
