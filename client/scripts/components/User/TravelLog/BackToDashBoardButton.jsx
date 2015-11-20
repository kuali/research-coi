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
import {Link} from 'react-router';

export class BackToDashBoardButton extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        display: 'block',
        verticalAlign: 'top',
        padding: '20px 30px 20px 30px',
        cursor: 'pointer',
        color: '#444',
        fontWeight: '300',
        borderBottom: '1px solid #c0c0c0',
        borderTop: '1px solid #c0c0c0'
      },
      primary: {
        fontSize: 28,
        fontWeight: 300
      },
      secondary: {
        fontSize: 22,
        fontWeight: 'bold'
      }
    };

    return (
      <Link to={`/coi/dashboard`} style={styles.container} name='Back Button'>
        <div>
          <span>
            <div style={styles.primary}>Back</div>
            <div style={styles.secondary}>To Dashboard</div>
          </span>
        </div>
      </Link>
    );
  }
}
