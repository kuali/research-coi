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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {GreyButton} from '../../grey-button';
import {AdminActions} from '../../../actions/admin-actions';
import DisclosureFilter from '../disclosure-filter';
import DoneWithFilterButton from '../done-with-filter-button';
import {COIConstants} from '../../../../../coi-constants';
const APPROVED = COIConstants.DISCLOSURE_STATUS.UP_TO_DATE;

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
    const options = this.props.possibleStatuses
      .filter(status => status.code !== APPROVED)
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((status) => {
        const id = `statFilt${status.code}`;
        return (
          <div className={styles.checkbox} key={status.code}>
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
          <div className={styles.checkbox} style={{padding: '10px 0'}} key={status.code}>
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
      <div className={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        {options}

        <div className={styles.approvedStatus}>
          {approved}
        </div>

        <GreyButton className={`${styles.override} ${styles.clearButton}`} onClick={this.clear}>
          <i className={classNames('fa', 'fa-times', styles.x)}></i>
          RESET FILTER
        </GreyButton>
      </div>
    );
  }
}
