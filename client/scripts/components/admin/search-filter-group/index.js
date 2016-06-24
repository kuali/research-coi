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
import {get} from 'lodash';
import {DisclosureFilterByStatus} from '../disclosure-filter-by-status';
import {DisclosureFilterByDate} from '../disclosure-filter-by-date';
import {DisclosureFilterByPI} from '../disclosure-filter-by-pi';
import {DisclosureFilterByDisposition} from '../disclosure-filter-by-disposition';
import {DisclosureFilterByReviewer} from '../disclosure-filter-by-reviewer';
import {DisclosureFilterByReviewStatus} from '../disclosure-filter-by-review-status';
import { LANES } from '../../../../../coi-constants';

export default function SearchFilterGroup(props) {
  const {
    className,
    visible,
    possibleDispositions,
    filters,
    sortDirection,
    showDateSort,
    possibleStatuses
  } = props;

  const classes = classNames(
    styles.container,
    className
  );

  let height = 0;
  if (!visible) {
    height = 119;
  }

  let dispositionFilter;
  if (Array.isArray(possibleDispositions) && possibleDispositions.length > 0) {
    let activeFilters = [];
    if (get(filters, 'disposition') !== undefined) {
      activeFilters = filters.disposition;
    }
    dispositionFilter = (
      <DisclosureFilterByDisposition
        activeFilters={activeFilters}
        possibleDispositions={possibleDispositions}
      />
    );

    if (!visible) {
      height += 32;
    }
  }

  let reviewerFilter;
  let reviewStatusFilter;
  if (props.lane === LANES.TEST) {
    reviewerFilter = (
      <DisclosureFilterByReviewer
        reviewers={props.reviewerFilterValues}
      />
    );

    reviewStatusFilter = (
      <DisclosureFilterByReviewStatus activeFilters={filters.reviewStatus} />
    );
  }

  return (
    <div className={classes} style={{marginTop: -height}}>
      <DisclosureFilterByDate
        startDate={filters.date.start}
        endDate={filters.date.end}
        sortDirection={sortDirection}
        showSort={showDateSort}
      />
      <DisclosureFilterByStatus
        activeFilters={filters.status}
        possibleStatuses={possibleStatuses}
      />
      <DisclosureFilterByPI
        piName={filters.submittedBy}
      />
      {dispositionFilter}
      {reviewerFilter}
      {reviewStatusFilter}
    </div>
  );
}