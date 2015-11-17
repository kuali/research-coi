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
import PencilIcon from '../DynamicIcons/PencilIcon';

export default class EditLink extends React.Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.id);
  }

  render() {
    let styles = {
      container: {
        borderBottom: window.colorBlindModeOn ? '1px dotted black' : '1px dotted #0095A0',
        cursor: 'pointer'
      },
      linkText: {
        paddingLeft: 2,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        verticalAlign: 'middle',
        fontSize: 8
      },
      icon: {
        width: 15,
        height: 15,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        verticalAlign: 'middle'
      }
    };

    return (
      <span onClick={this.onClick} style={merge(styles.container, this.props.style)}>
        <PencilIcon style={styles.icon} />
        <span style={styles.linkText}>EDIT</span>
      </span>
    );
  }
}
