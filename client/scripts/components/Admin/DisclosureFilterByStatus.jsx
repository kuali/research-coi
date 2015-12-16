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
import {GreyButton} from '../GreyButton';
import {AdminActions} from '../../actions/AdminActions';
import DisclosureFilter from './DisclosureFilter';
import DoneWithFilterButton from './DoneWithFilterButton';
import {COIConstants} from '../../../../COIConstants';
const APPROVED = COIConstants.DISCLOSURE_STATUS.UP_TO_DATE;
import {merge} from '../../merge';

export class DisclosureFilterByStatus extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'STATUS';

    this.toggleFilter = this.toggleFilter.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  clear(e) {
    AdminActions.clearStatusFilter();
    e.stopPropagation();
  }

  toggleFilter(evt) {
    const code = Number(evt.target.id.replace('statFilt', ''));
    const theStatus = this.props.possibleStatuses
      .find(status => status.code === code);
    AdminActions.toggleStatusFilter(theStatus);
  }

  isChecked(value) {
    return this.props.activeFilters.some(filter => filter === value);
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    const styles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black',
        width: 238
      },
      checkbox: {
        textAlign: 'left',
        padding: 10,
        fontSize: 15
      },
      clearButton: {
        backgroundColor: '#DFDFDF',
        color: 'black',
        borderBottom: '3px solid #717171',
        float: 'right',
        padding: '4px 7px',
        width: 135,
        margin: '10px 0'
      },
      x: {
        fontSize: 15,
        paddingRight: 8
      },
      approvedStatus: {
        borderTop: '1px solid #AAA',
        borderBottom: '1px solid #AAA',
        padding: '6px 0',
        margin: '0 10px 12px 10px'
      }
    };

    const options = this.props.possibleStatuses
      .filter(status => status.code !== APPROVED)
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((status) => {
        const id = `statFilt${status.code}`;
        return (
          <div style={styles.checkbox} key={status.code}>
            <input
              id={id}
              type="checkbox"
              checked={this.isChecked(status.code)}
              onChange={this.toggleFilter}
            />
            <label htmlFor={id} style={{paddingLeft: 9}}>{status.label}</label>
          </div>
        );
      });

    const approved = this.props.possibleStatuses
      .filter(status => status.code === APPROVED)
      .map(status => {
        const id = `statFilt${status.code}`;
        return (
          <div style={merge(styles.checkbox, {padding: '10px 0'})} key={status.code}>
            <input
              id={id}
              type="checkbox"
              checked={this.isChecked(status.code)}
              onChange={this.toggleFilter}
            />
            <label htmlFor={id} style={{paddingLeft: 9}}>{status.label}</label>
          </div>
        );
      });

    return (
      <div style={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        {options}

        <div style={styles.approvedStatus}>
          {approved}
        </div>

        <GreyButton style={styles.clearButton} onClick={this.clear}>
          <i className="fa fa-times" style={styles.x}></i>
          CLEAR FILTER
        </GreyButton>
      </div>
    );
  }
}
