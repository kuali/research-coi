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
import {TravelLogActions} from '../../../actions/TravelLogActions';

export class TravelLogSort extends React.Component {
  constructor() {
    super();

    this.sortColumnChanged = this.sortColumnChanged.bind(this);
    this.sortDirectionChanged = this.sortDirectionChanged.bind(this);
  }

  sortColumnChanged(evt) {
    TravelLogActions.sortColumnChanged(evt.target.value);
  }

  sortDirectionChanged(evt) {
    TravelLogActions.sortDirectionChanged(evt.target.value);
  }

  filterChanged(evt) {
    TravelLogActions.filterChanged(evt.target.value);
  }

  render() {
    let styles = {
      container: {
      },
      select: {
        width: 150,
        height: 27,
        fontSize: 14,
        borderBottom: this.props.invalid ? '3px solid red' : '1px solid #aaa',
        marginRight: 8
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
          <select style={styles.select} onChange={this.sortColumnChanged}>
            <option value="name">Entity Name</option>
            <option value="date">Date</option>
            <option value="destination">Destination</option>
            <option value="amount">Amount</option>
          </select>
          <span style={styles.label}></span>
          <select style={styles.select} onChange={this.sortDirectionChanged}>
            <option value="ASCENDING">Ascending</option>
            <option value="DESCENDING">Descending</option>
          </select>
          <div style={{float: 'right'}}>
            <span style={styles.label}>View By:</span>
            <select style={styles.select} onChange={this.filterChanged}>
              <option value="all">All</option>
              <option value="disclosed">Already Disclosed</option>
              <option value="notYetdisclosed">Not Yet Disclosed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
