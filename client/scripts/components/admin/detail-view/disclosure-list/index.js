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

        if ((theList.clientHeight + theList.scrollTop) > (theList.scrollHeight - 300)) {
          if (!this.props.loadingMore) {
            AdminActions.loadMore();
          }
        }
      }
    });
  }

  changeSearch(newSearch) {
    AdminActions.changeSearch(newSearch);
  }

  render() {
    let disclosuresJsx;
    if (this.props.summaries) {
      disclosuresJsx = this.props.summaries.map(disclosure => {
        let selectedId;
        if (this.props.selected) {
          selectedId = this.props.selected.id;
        }
        return (
          <DisclosureListItem
            key={disclosure.id}
            disclosure={disclosure}
            selected={disclosure.id === selectedId}
            searchTerm={this.props.searchTerm}
          />
        );
      });
    }

    let loadMoreButton;
    if (!this.props.loadedAll && !this.props.loadingMore) {
      loadMoreButton = (
        <div className={styles.loadMoreButton}>
          <BlueButton onClick={AdminActions.loadMore}>Load more</BlueButton>
        </div>
      );
    }

    let loadingIndicator;
    if (this.props.loadingMore) {
      loadingIndicator = (
        <div className={styles.loadingIndicator}>
          <span>Loading more...</span>
        </div>
      );
    }

    const { configState } = this.context;

    const possibleStatuses = [
      {code: 2, label: getAdminDisclosureStatusString(configState, 2, configState.config.id)},
      {code: 3, label: getAdminDisclosureStatusString(configState, 3, configState.config.id)},
      {code: 4, label: getAdminDisclosureStatusString(configState, 4, configState.config.id)},
      {code: 5, label: getAdminDisclosureStatusString(configState, 5, configState.config.id)},
      {code: 6, label: getAdminDisclosureStatusString(configState, 6, configState.config.id)}
    ];

    const possibleTypes = [];
    if (configState.config.disclosureTypes) {
      configState.config.disclosureTypes.map(type => {
        return type.description;
      });
    }

    let possibleDispositions = [];
    const dispositionsEnabled = getDispositionsEnabled(configState);
    if (dispositionsEnabled) {
      possibleDispositions = this.props.possibleDispositions;
    }

    const classes = classNames(
      'flexbox',
      'column',
      styles.container,
      this.props.className,
      {[styles.showFilters]: this.props.showFilters}
    );

    let heading;
    if (this.props.summaries.length === this.props.count) {
      heading = (
        <div className={styles.heading} onClick={AdminActions.toggleFilters}>
          <span style={{paddingRight: 3}}>{this.props.count}</span>
          Disclosures Shown
          <span className={styles.filterArrow}>&#9660;</span>
        </div>
      );
    }
    else {
      heading = (
        <div className={styles.heading} onClick={AdminActions.toggleFilters}>
          <span style={{paddingRight: 3}}>{this.props.summaries.length}</span>
          <span style={{paddingRight: 3}}>of</span>
          <span style={{paddingRight: 3}}>{this.props.count}</span>
          Disclosures Shown
          <span className={styles.filterArrow}>&#9660;</span>
        </div>
      );
    }

    return (
      <div className={classes}>
        <AdminMenu style={{padding: '32px 0px'}} />
        <div style={{width: 320}}>
          <DisclosureFilterSearch
            query={this.props.filters.search}
            onChange={this.changeSearch}
            onSearch={AdminActions.doSearch}
          />
          {heading}
          <SearchFilterGroup
            className={`${styles.override} ${styles.filterGroup}`}
            filters={this.props.filters}
            reviewerFilterValues={this.props.reviewerFilterValues}
            lane={configState.config.lane}
            possibleStatuses={possibleStatuses}
            possibleTypes={possibleTypes}
            possibleDispositions={possibleDispositions}
            showDateSort={false}
            visible={this.props.showFilters}
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
