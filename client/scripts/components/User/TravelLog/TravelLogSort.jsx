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

import React from 'react/addons';

export class TravelLogSort extends React.Component {
  constructor() {
    super();
    this.commonStyles = {};
  }

  render() {
    let styles = {
      container: {
      },
      select: {
        width: 175,
        height: 27,
        fontSize: 14,
        borderBottom: this.props.invalid ? '3px solid red' : '1px solid #aaa'
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
      },
      label: {
        fontSize: 14,
        marginRight: '5px'
      }
    };

    return (
      <div style={styles.container}>
        <div>
          <span style={styles.label}>Sort By:</span>
          <select style={styles.select}>
            <option value="Entity Name">Entity Name</option>
            <option value="Date">Date</option>
            <option value="Destination">Destination</option>
            <option value="Amount">Amount</option>
          </select>
          <span style={styles.label}></span>
          <select style={styles.select}>
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>
          <div style={{float: 'right'}}>
            <span style={styles.label}>View By:</span>
            <select style={styles.select}>
              <option value="All">All</option>
              <option value="Already Disclosed">Already Disclosed</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
