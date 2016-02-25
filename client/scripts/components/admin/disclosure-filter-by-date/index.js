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
import classNames from 'classnames';
import React from 'react';
import {DatePicker} from '../../date-picker';
import {GreyButton} from '../../grey-button';
import {AdminActions} from '../../../actions/admin-actions';
import DisclosureFilter from '../disclosure-filter';
import DoneWithFilterButton from '../done-with-filter-button';

export class DisclosureFilterByDate extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'DATE/DATE RANGE';
  }

  clear(e) {
    AdminActions.clearDateFilter();
    e.stopPropagation();
  }

  setFromDate(newValue) {
    AdminActions.setStartDateFilter(newValue);
  }

  setToDate(newValue) {
    AdminActions.setEndDateFilter(newValue);
  }

  setOrder(evt) {
    AdminActions.setSortDirection(evt.target.value);
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    let sortFields;
    if (this.props.showSort) {
      sortFields = (
        <div className={styles.inputDivs}>
          <label htmlFor="dateSort" className={styles.label}>Sort</label>
          <select className={styles.dropDown} id="dateSort" value={this.props.sortDirection} onChange={this.setOrder}>
            <option value="DESCENDING">Newest - Oldest</option>
            <option value="ASCENDING">Oldest - Newest</option>
          </select>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        <div className={styles.theDates}>
          <span style={{marginRight: 25}}>
            <label htmlFor="fromDate" className={styles.label}>FROM DATE:</label>
            <DatePicker id="fromDate" onChange={this.setFromDate} value={this.props.startDate} />
          </span>
          <span>
            <label htmlFor="toDate" className={styles.label}>TO DATE:</label>
            <DatePicker id="toDate" onChange={this.setToDate} value={this.props.endDate} />
          </span>
        </div>
        {sortFields}
        <div>
          <GreyButton className={`${styles.override} ${styles.clearButton}`} onClick={this.clear}>
            <i className={classNames('fa', 'fa-times', styles.x)}></i>
            CLEAR FILTER
          </GreyButton>
        </div>
      </div>
    );
  }
}
