/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import styles from './style';
import React from 'react';
import {TravelLogActions} from '../../../../actions/travel-log-actions';

export default class TravelLogSort extends React.Component {
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
    return (
      <div className={styles.container} name='Travel Log Sort'>
        <div>
          <span className={styles.label}>Sort By:</span>
          <select className={styles.select} onChange={this.sortColumnChanged}>
            <option value="name">Entity Name</option>
            <option value="date">Date</option>
            <option value="destination">Destination</option>
            <option value="amount">Amount</option>
          </select>
          <span className={styles.label}></span>
          <select className={styles.select} onChange={this.sortDirectionChanged}>
            <option value="ASCENDING">Ascending</option>
            <option value="DESCENDING">Descending</option>
          </select>
          <div style={{float: 'right'}}>
            <span className={styles.label}>View By:</span>
            <select className={styles.select} onChange={this.filterChanged}>
              <option value="all">All</option>
              <option value="disclosed">Already Disclosed</option>
              <option value="notYetDisclosed">Not Yet Disclosed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
