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

export default function SubmitLink(props: Object): React.Element {
  let styles = {
    container: {
      fontSize: 15,
      cursor: props.disabled ? 'default' : 'pointer',
      color: window.colorBlindModeOn ? 'black' : '#555555'
    },
    stepLabel: {
      verticalAlign: 'middle'
    },
    icon: {
      color: window.colorBlindModeOn ? 'black' : '#F57C00',
      fontSize: 29,
      marginRight: 6,
      verticalAlign: 'middle'
    }
  };

  if (props.disabled) {
    styles.container.color = '#AAA';
    styles.icon.color = '#AAA';
  }

  return (
    <div onClick={props.onClick} style={merge(styles.container, props.style)}>
      <i className="fa fa-arrow-circle-right" style={styles.icon}></i>
      <span style={styles.stepLabel}>
        SUBMIT
      </span>
    </div>
  );
}
