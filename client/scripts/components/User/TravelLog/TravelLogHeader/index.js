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

export class TravelLogHeader extends React.Component {
  render() {
    const styles = {
      container: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        boxShadow: '0 2px 8px #D5D5D5'
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        textTransform: 'uppercase',
        fontWeight: 300,
        color: '#444'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <h2 style={styles.heading}>
         Travel Log
        </h2>
      </div>
    );
  }
}
