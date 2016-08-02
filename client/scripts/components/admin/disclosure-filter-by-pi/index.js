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
import PISearchBox from '../pi-search-box';

export class DisclosureFilterByPI extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'SUBMITTED BY';
  }

  clear(e) {
    AdminActions.clearSubmittedByFilter();
    e.stopPropagation();
  }

  piSelected(piName) {
    AdminActions.setSubmittedByFilter(piName.value);
  }

  // This method must be implemented. It will be called by DisclosureFilter.
  setActiveStatus({ piName }) {
    let active = true;
    if (piName === undefined) {
      active = false;
    }
    this.setState({ active });
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    return (
      <div className={styles.container}>
        <DoneWithFilterButton onClick={this.close} />

        <label htmlFor="pisearchbox" style={{fontSize: 13}}>SEARCH FOR NAME:</label>

        <div className={styles.searchBoxDiv}>
          <PISearchBox value={this.props.piName} onSelected={this.piSelected} />
        </div>

        <GreyButton className={`${styles.override} ${styles.clearButton}`} onClick={this.clear}>
          <i className={classNames('fa', 'fa-times', styles.x)} />
          CLEAR FILTER
        </GreyButton>
      </div>
    );
  }
}
