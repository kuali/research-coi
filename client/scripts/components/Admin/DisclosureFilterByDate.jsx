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

import React from 'react'; //eslint-disable-line no-unused-vars
import {DatePicker} from '../DatePicker';
import {GreyButton} from '../GreyButton';
import {AdminActions} from '../../actions/AdminActions';
import DisclosureFilter from './DisclosureFilter';
import DoneWithFilterButton from './DoneWithFilterButton';

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
    let styles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black',
        position: 'relative'
      },
      inputDivs: {
      },
      label: {
        display: 'block',
        fontSize: 13,
        paddingBottom: 4
      },
      dropDown: {
        width: 176,
        height: 27,
        backgroundColor: 'white',
        fontSize: 14,
        borderBottom: '1px solid #aaa'
      },
      clearButton: {
        backgroundColor: '#DFDFDF',
        color: 'black',
        borderBottom: '3px solid #717171',
        float: 'right',
        padding: '4px 7px',
        width: 135,
        margin: '10px 0 20px 0'
      },
      x: {
        fontSize: 15,
        paddingRight: 8
      },
      theDates: {
        margin: '10px 10px 20px 10px',
        paddingBottom: 30,
        borderBottom: '1px solid #AAA'
      }
    };

    let sortFields;
    if (this.props.showSort) {
      sortFields = (
        <div style={styles.inputDivs}>
          <label htmlFor="dateSort" style={styles.label}>Sort</label>
          <select style={styles.dropDown} id="dateSort" value={this.props.sortDirection} onChange={this.setOrder}>
            <option value="DESCENDING">Newest - Oldest</option>
            <option value="ASCENDING">Oldest - Newest</option>
          </select>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        <div style={styles.theDates}>
          <span style={{marginRight: 25}}>
            <label htmlFor="fromDate" style={styles.label}>FROM DATE:</label>
            <DatePicker id="fromDate" onChange={this.setFromDate} value={this.props.startDate} />
          </span>
          <span>
            <label htmlFor="toDate" style={styles.label}>TO DATE:</label>
            <DatePicker id="toDate" onChange={this.setToDate} value={this.props.endDate} />
          </span>
        </div>
        {sortFields}
        <div>
          <GreyButton style={styles.clearButton} onClick={this.clear}>
            <i className="fa fa-times" style={styles.x}></i>
            CLEAR FILTER
          </GreyButton>
        </div>
      </div>
    );
  }
}
