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
import {GreyButton} from '../../grey-button';
import {AdminActions} from '../../../actions/admin-actions';
import DisclosureFilter from '../disclosure-filter';
import DoneWithFilterButton from '../done-with-filter-button';

export class DisclosureFilterByType extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'TYPE';

    this.toggleFilter = this.toggleFilter.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  clear(e) {
    AdminActions.clearTypeFilter();
    e.stopPropagation();
  }

  toggleFilter(evt) {
    const index = Number(evt.target.id.replace('typeFilt', ''));
    AdminActions.toggleTypeFilter(this.props.possibleTypes[index]);
  }

  isChecked(value) {
    return this.props.activeFilters.find(filter => {
      return filter === value;
    }) !== undefined;
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    const options = this.props.possibleTypes.map((type, index) => {
      const id = `typeFilt${index}`;
      return (
        <div className={styles.checkbox} key={type}>
          <input
            id={id}
            type="checkbox"
            checked={this.isChecked(type)}
            onChange={this.toggleFilter}
          />
          <label htmlFor={id}>{type}</label>
        </div>
      );
    });

    return (
      <div className={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        {options}
        <GreyButton className={`${styles.override} ${styles.clearButton}`} onClick={this.clear}>
          <i className={classNames('fa', 'fa-times', styles.x)} />
          CLEAR FILTER
        </GreyButton>
      </div>
    );
  }
}
