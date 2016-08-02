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
import AutoSuggest from '../../auto-suggest';
import Suggestion from '../../suggestion';
import Reviewer from './reviewer';

export class DisclosureFilterByReviewer extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'REVIEWER';
    this.state = {
      value: ''
    };
    this.filterValues = this.filterValues.bind(this);
  }

  clear(e) {
    AdminActions.clearReviewerFilter();
    e.stopPropagation();
  }

  reviewerSelected(reviewer) {
    AdminActions.setReviewerFilter(reviewer);
  }

  // This method must be implemented. It will be called by DisclosureFilter.
  setActiveStatus({ reviewers }) {
    let active = true;
    if (!reviewers) {
      active = false;
    }
    this.setState({ active });
  }

  filterValues(values) {
    if (Array.isArray(this.props.reviewers) && this.props.reviewers.length > 0 ) {
      return values.filter(value => {
        return !this.props.reviewers.some(r => r.userId === value.userId );
      });
    }

    return values;
  }
  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    let reviewers;
    if (Array.isArray(this.props.reviewers) && this.props.reviewers.length > 0 ) {
      reviewers = this.props.reviewers.map((reviewer, index) => {
        return (
          <Reviewer
            {...reviewer}
            key={index}
          />
        );
      });
    }

    return (
      <div className={styles.container}>
        <DoneWithFilterButton onClick={this.close} />

        <label htmlFor="pisearchbox" style={{fontSize: 13}}>SEARCH FOR REVIEWER:</label>

        <div className={styles.searchBoxDiv}>
          <AutoSuggest
            endpoint='/api/coi/reviewers'
            suggestion={Suggestion}
            onSuggestionSelected={this.reviewerSelected}
            filter={this.filterValues}
            inline={true}
          />
        </div>
        <div>
          {reviewers}
        </div>

        <GreyButton className={`${styles.override} ${styles.clearButton}`} onClick={this.clear}>
          <i className={classNames('fa', 'fa-times', styles.x)} />
          CLEAR FILTER
        </GreyButton>
      </div>
    );
  }
}
