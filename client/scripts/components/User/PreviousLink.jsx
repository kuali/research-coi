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

export default function PreviousLink(props: Object): React.Element {
  let styles = {
    container: {
      fontSize: 15,
      cursor: 'pointer',
      color: window.colorBlindModeOn ? 'black' : '#555555'
    },
    icons: {
      color: window.colorBlindModeOn ? 'black' : '#F57C00',
      fontSize: 29,
      marginRight: 6,
      verticalAlign: 'middle'
    },
    stepLabel: {
      verticalAlign: 'middle'
    }
  };

  return (
    <div onClick={props.onClick} style={merge(styles.container, props.style)}>
      <i className="fa fa-arrow-circle-left" style={styles.icons}></i>
      <span style={styles.stepLabel}>
        {props.label}
      </span>
    </div>
  );
}
