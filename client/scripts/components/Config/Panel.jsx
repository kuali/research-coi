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

export default class Panel extends React.Component {
  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        boxShadow: '0 0 10px #BBB',
        marginBottom: 22,
        borderRadius: 5
      },
      title: {
        borderBottom: '1px solid #AAA',
        padding: '10px 17px',
        fontSize: 17,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '5px 5px 0 0',
        overflow: 'hidden'
      },
      content: {
        padding: 10,
        borderRadius: '0 0 5px 5px'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          {this.props.title}
        </div>
        <div style={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
