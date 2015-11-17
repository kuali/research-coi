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

export class SortArrow extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        fontSize: 9,
        marginLeft: 5,
        verticalAlign: 'middle'
      }
    };

    let arrow;
    if (this.props.direction === 'DESCENDING') {
      arrow = (
        <span style={merge(styles.container, this.props.style)}>
          &#9660;
        </span>
      );
    }
    else {
      arrow = (
        <span style={merge(styles.container, this.props.style)}>
          &#9650;
        </span>
      );
    }

    return arrow;
  }
}
