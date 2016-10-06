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
import {DisclosureListItem} from '../disclosure-list-item';
import {DisclosureFilterSearch} from '../../disclosure-filter-search';
import SearchFilterGroup from '../../search-filter-group';
import {AdminActions} from '../../../../actions/admin-actions';
import {BlueButton} from '../../../blue-button';
import {
  getAdminDisclosureStatusString,
  getDispositionsEnabled
} from '../../../../stores/config-store';
import AdminMenu from '../../../admin-menu';
import {flagIsOn} from '../../../../feature-flags';

function getStatusDescription(configState, code) {
  return getAdminDisclosureStatusString(
    configState,
    code,
    configState.config.id
  );
}

export class DisclosureList extends React.Component {
  componentDidMount() {
    const theList = this.refs.theList;
    let enabled = true;
    theList.addEventListener('scroll', () => {
      if (enabled) {
        enabled = false;
        setTimeout(() => {
          enabled = true;
        }, 100);

        if (
          (theList.clientHeight + theList.scrollTop) >
          (theList.scrollHeight - 300)
        ) {
          if (!this.props.loadingMore) {
            AdminActions.loadMore();
          }
        }
      }
    });
  }

  render() {
    const {
      summaries,
      selected,
      searchTerm,
      loadedAll,
      loadingMore,
      className,
      showFilters,
      count,
      filters,
      reviewerFilterValues
    } = this.props;

    let disclosuresJsx;
    if (summaries) {
      disclosuresJsx = summaries.map(disclosure => {
        let selectedId;
        if (selected) {
          selectedId = selected.id;
        }
        return (
          <DisclosureListItem
            key={disclosure.id}
            disclosure={disclosure}
            selected={disclosure.id === selectedId}
            searchTerm={searchTerm}
          />
        );
      });
    }

    let loadMoreButton;
    let loadingIndicator;
    if (loadingMore) {
      loadingIndicator = (
        <div className={styles.loadingIndicator}>
          <span>Loading more...</span>
        </div>
      );
    }
    else if (!loadedAll) {
      loadMoreButton = (
        <div className={styles.loadMoreButton}>
          <BlueButton onClick={AdminActions.loadMore}>Load more</BlueButton>
        </div>
      );
    }

    const { configState } = this.context;

    const possibleStatuses = [
      {code: 2, label: getStatusDescription(configState, 2)},
      {code: 3, label: getStatusDescription(configState, 3)},
      {code: 4, label: getStatusDescription(configState, 4)},
      {code: 5, label: getStatusDescription(configState, 5)},
      {code: 6, label: getStatusDescription(configState, 6)},
      {code: 7, label: getStatusDescription(configState, 7)}
    ];
    if (flagIsOn('RESCOI-995')) {
      possibleStatuses.push({
        code: 8,
        label: getStatusDescription(configState, 8)
      });
    }

    let possibleDispositions = [];
    const dispositionsEnabled = getDispositionsEnabled(configState);
    if (dispositionsEnabled) {
      possibleDispositions = this.props.possibleDispositions;
    }

    let heading;
    if (summaries) {
      if (summaries.length === count) {
        heading = (
          <div className={styles.heading} onClick={AdminActions.toggleFilters}>
            <span style={{paddingRight: 3}}>{count}</span>
            Disclosures Shown
            <span className={styles.filterArrow}>&#9660;</span>
          </div>
        );
      }
      else {
        heading = (
          <div className={styles.heading} onClick={AdminActions.toggleFilters}>
            <span style={{paddingRight: 3}}>{summaries.length}</span>
            <span style={{paddingRight: 3}}>of</span>
            <span style={{paddingRight: 3}}>{count}</span>
            Disclosures Shown
            <span className={styles.filterArrow}>&#9660;</span>
          </div>
        );
      }
    }

    const classes = classNames(
      'flexbox',
      'column',
      styles.container,
      className,
      {[styles.showFilters]: showFilters}
    );

    return (
      <div className={classes}>
        <AdminMenu style={{padding: '32px 0px'}} />
        <div style={{width: 320}}>
          <DisclosureFilterSearch
            query={filters.search}
            onChange={AdminActions.changeSearch}
            onSearch={AdminActions.doSearch}
          />
          {heading}
          <SearchFilterGroup
            className={`${styles.override} ${styles.filterGroup}`}
            filters={filters}
            reviewerFilterValues={reviewerFilterValues}
            lane={configState.config.lane}
            possibleStatuses={possibleStatuses}
            possibleDispositions={possibleDispositions}
            showDateSort={false}
            visible={showFilters}
          />
        </div>
        <ul className={classNames('fill', styles.list)} ref="theList">
          {disclosuresJsx}
          {loadMoreButton}
          {loadingIndicator}
        </ul>
      </div>
    );
  }
}

DisclosureList.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};

DisclosureList.propTypes = {
  summaries: React.PropTypes.array,
  selected: React.PropTypes.object,
  className: React.PropTypes.string,
  filters: React.PropTypes.object,
  reviewerFilterValues: React.PropTypes.array,
  count: React.PropTypes.number,
  searchTerm: React.PropTypes.string,
  loadingMore: React.PropTypes.bool,
  loadedAll: React.PropTypes.bool,
  showFilters: React.PropTypes.bool,
  possibleDispositions: React.PropTypes.array
};
