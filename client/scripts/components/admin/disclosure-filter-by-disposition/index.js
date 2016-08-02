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
import { NO_DISPOSITION } from '../../../../../coi-constants';

export class DisclosureFilterByDisposition extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'DISPOSITION';

    this.toggleFilter = this.toggleFilter.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  clear(e) {
    AdminActions.clearDispositionFilter();
    e.stopPropagation();
  }

  toggleFilter(evt) {
    const code = Number(evt.target.id.replace('disposFilt', ''));
    let theDisposition;
    if (code === NO_DISPOSITION) {
      theDisposition = {
        description: 'No Disposition',
        order: 0,
        typeCd: NO_DISPOSITION
      };
    } else {
      theDisposition = this.props.possibleDispositions.find(disposition =>
        disposition.typeCd === code
      );
    }
    AdminActions.toggleDispositionFilter(theDisposition);
  }

  isChecked(value) {
    if (this.props.activeFilters === null) {
      return true;
    }
    return this.props.activeFilters.some(filter => filter === value);
  }

  setActiveStatus({ activeFilters }) {
    let active = true;
    if (activeFilters === null) {
      active = false;
    }
    this.setState({ active });
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    const options = this.props.possibleDispositions
      .sort((a, b) => a.order - b.order)
      .map(disposition => {
        const id = `disposFilt${disposition.typeCd}`;
        return (
          <div className={styles.checkbox} key={disposition.typeCd}>
            <input
              id={id}
              type="checkbox"
              checked={this.isChecked(disposition.typeCd)}
              onChange={this.toggleFilter}
            />
            <label htmlFor={id} style={{paddingLeft: 9}}>
              {disposition.description}
            </label>
          </div>
        );
      });

    return (
      <div className={styles.container} key="-1">
        <DoneWithFilterButton onClick={this.close} />
        <div className={styles.checkbox}>
          <input
            id={`disposFilt${NO_DISPOSITION}`}
            type="checkbox"
            checked={this.isChecked(NO_DISPOSITION)}
            onChange={this.toggleFilter}
          />
          <label htmlFor={`disposFilt${NO_DISPOSITION}`} style={{paddingLeft: 9}}>
            No Disposition
          </label>
        </div>
        {options}

        <GreyButton
          className={`${styles.override} ${styles.clearButton}`}
          onClick={this.clear}
        >
          <i className={classNames('fa', 'fa-times', styles.x)} />
          RESET FILTER
        </GreyButton>
      </div>
    );
  }
}
