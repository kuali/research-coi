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
import {AdminStore} from '../../../../stores/admin-store';
import {AdminActions} from '../../../../actions/admin-actions';
import SearchFilterGroup from '../../search-filter-group';
import {DisclosureTable} from '../disclosure-table';
import {DisclosureFilterSearch} from '../../disclosure-filter-search';
import {BlueButton} from '../../../blue-button';
import ConfigStore from '../../../../stores/config-store';
import AdminMenu from '../../../admin-menu';
import {AppHeader} from '../../../app-header';
import UserInfoStore from '../../../../stores/user-info-store';

export class ListView extends React.Component {
  constructor() {
    super();

    this.state = {
      data: AdminStore.getState(),
      config: ConfigStore.getState().config,
      userInfo: UserInfoStore.getState().userInfo
    };

    this.changeSearch = this.changeSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  componentDidMount() {
    AdminStore.listen(this.onChange);
    ConfigStore.listen(this.onChange);

    const rightPanel = this.refs.rightPanel;
    let enabled = true;
    rightPanel.addEventListener('scroll', () => {
      if (enabled) {
        enabled = false;
        setTimeout(() => {
          enabled = true;
        }, 100);

        if ((rightPanel.clientHeight + rightPanel.scrollTop) > (rightPanel.scrollHeight - 300)) {
          if (!this.state.data.applicationState.loadingMore) {
            AdminActions.loadMore();
          }
        }
      }
    });
  }

  loadMore() {
    AdminActions.loadMore();
  }

  componentWillUnmount() {
    AdminStore.unlisten(this.onChange);
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState({
      data: AdminStore.getState(),
      config: ConfigStore.getState().config,
      userInfo: UserInfoStore.getState().userInfo
    });
  }

  doSearch() {
    AdminActions.doSearch();
  }

  changeType(newType) {
    AdminActions.changeTypeFilter(newType);
  }

  changeSearch(newSearch) {
    AdminActions.changeSearch(newSearch);
  }

  toggleFilters() {
    AdminActions.toggleFilters();
  }

  render() {
    const filtered = this.state.data.disclosureSummaries;
    let loadMoreButton;
    if (!this.state.data.applicationState.loadedAll && !this.state.data.applicationState.loadingMore) {
      loadMoreButton = (
        <div className={styles.loadMoreButton}>
          <BlueButton onClick={this.loadMore}>Load more</BlueButton>
        </div>
      );
    }

    let loadingIndicator;
    if (this.state.data.applicationState.loadingMore) {
      loadingIndicator = (
        <div className={styles.loadingIndicator}>
          <span>Loading more...</span>
        </div>
      );
    }

    const possibleStatuses = [
      {code: 2, label: ConfigStore.getAdminDisclosureStatusString(2)},
      {code: 3, label: ConfigStore.getAdminDisclosureStatusString(3)},
      {code: 4, label: ConfigStore.getAdminDisclosureStatusString(4)},
      {code: 5, label: ConfigStore.getAdminDisclosureStatusString(5)},
      {code: 6, label: ConfigStore.getAdminDisclosureStatusString(6)},
      {code: 7, label: ConfigStore.getAdminDisclosureStatusString(7)}
    ];

    const possibleTypes = [];
    if (this.state.config.disclosureTypes) {
      this.state.config.disclosureTypes.map(type => {
        return type.description;
      });
    }

    let possibleDispositions = [];
    if (ConfigStore.getDispostionsEnabled()) {
      possibleDispositions = this.state.config.dispositionTypes;
    }

    const classes = classNames(
      'flexbox',
      'fill',
      'row',
      styles.container,
      this.props.className,
      {[styles.showFilters]: this.state.data.applicationState.showFilters}
    );

    let heading;
    if (filtered.length === this.state.data.applicationState.summaryCount) {
      heading = (
        <div className={styles.heading} onClick={this.toggleFilters}>
          <span style={{paddingRight: 3}}>
            {this.state.data.applicationState.summaryCount}
          </span>
          Disclosures Shown
          <span className={styles.filterArrow}>&#9660;</span>
        </div>
      );
    }
    else {
      heading = (
        <div className={styles.heading} onClick={this.toggleFilters}>
          <span style={{paddingRight: 3}}>
            {filtered.length}
          </span>
          <span style={{paddingRight: 3}}>of</span>
          <span style={{paddingRight: 3}}>
            {this.state.data.applicationState.summaryCount}
          </span>
          Disclosures Shown
          <span className={styles.filterArrow}>&#9660;</span>
        </div>
      );
    }

    return (
      <div className={`flexbox column`} style={{height: '100%', overflowX: 'hidden'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <div className={classes}>
          <span className={styles.sidebar}>
            <AdminMenu role={this.state.userInfo.coiRole} />
            <DisclosureFilterSearch
              query={this.state.data.applicationState.filters.search}
              onChange={this.changeSearch}
              onSearch={this.doSearch}
            />
            {heading}
            <SearchFilterGroup
              className={`${styles.override} ${styles.filterGroup}`}
              filters={this.state.data.applicationState.filters}
              possibleStatuses={possibleStatuses}
              possibleTypes={possibleTypes}
              possibleDispositions={possibleDispositions}
              showDateSort={false}
              visible={this.state.data.applicationState.showFilters}
            />
          </span>
          <span className={`fill ${styles.content}`} ref="rightPanel">
            <div className={styles.header2}>
              <h2 className={styles.title}>COI ADMIN DASHBOARD</h2>
            </div>
            <div style={{padding: '33px 38px'}}>
              <DisclosureTable
                sort={this.state.data.applicationState.sort}
                sortDirection={this.state.data.applicationState.sortDirection}
                page={this.state.data.applicationState.page}
                className={`${styles.override} ${styles.table}`}
                disclosures={filtered}
                searchTerm={this.state.data.applicationState.effectiveSearchValue}
              />
              {loadMoreButton}
              {loadingIndicator}
            </div>
          </span>
        </div>
      </div>
    );
  }
}
