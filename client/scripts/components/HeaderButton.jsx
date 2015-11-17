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
import {merge} from '../merge';

export class HeaderButton extends React.Component {
  render() {
    let styles = {
      container: {
        padding: '8px 10px 0 10px',
        height: '100%',
        display: 'inline-block'
      },
      label: {
        color: '#676767',
        fontSize: 12,
        marginLeft: 4,
        verticalAlign: 'middle'
      },
      icon: {
        color: '#676767',
        height: 26,
        verticalAlign: 'middle',
        width: 26
      }
    };

    return (
      <span style={merge(styles.container, this.props.style)}>
        <this.props.icon style={styles.icon} />
        <span style={styles.label}>
          {this.props.label}
        </span>
      </span>
    );
  }
}
