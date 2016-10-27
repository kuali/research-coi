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
import {
  getAdminDisclosureStatusString,
  getDispositionsEnabled
} from '../../../../stores/config-store';
import AdminMenu from '../../../admin-menu';
import {AppHeader} from '../../../app-header';

function getStatusDescription(configState, code) {
  return getAdminDisclosureStatusString(
    configState,
    code,
    configState.config.id
  );
}

export class ListView extends React.Component {
  constructor() {
    super();

    this.state = {
      data: AdminStore.getState()
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AdminStore.listen(this.onChange);

    const rightPanel = this.refs.rightPanel;
    let enabled = true;
    rightPanel.addEventListener('scroll', () => {
      if (enabled) {
        enabled = false;
        setTimeout(() => {
          enabled = true;
        }, 100);

        if (
          (rightPanel.clientHeight + rightPanel.scrollTop) >
          (rightPanel.scrollHeight - 300)
        ) {
          if (!this.state.data.applicationState.loadingMore) {
            AdminActions.loadMore();
          }
        }
      }
    });
  }

  componentWillUnmount() {
    AdminStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState({
      data: AdminStore.getState()
    });
  }

  render() {
    const {
      applicationState,
      disclosureSummaries
    } = this.state.data;

    let loadMoreButton;
    let loadingIndicator;
    if (applicationState.loadingMore) {
      loadingIndicator = (
        <div className={styles.loadingIndicator}>
          <span>Loading more...</span>
        </div>
      );
    }
    else if (!applicationState.loadedAll) {
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
      {code: 7, label: getStatusDescription(configState, 7)},
      {code: 8, label: getStatusDescription(configState, 8)}
    ];

    let possibleDispositions = [];
    if (getDispositionsEnabled(configState)) {
      possibleDispositions = configState.config.dispositionTypes;
    }

    const classes = classNames(
      'flexbox',
      'fill',
      'row',
      styles.container,
      this.props.className,
      {[styles.showFilters]: applicationState.showFilters}
    );

    let heading;
    if (disclosureSummaries.length === applicationState.summaryCount) {
      heading = (
        <div className={styles.heading} onClick={AdminActions.toggleFilters}>
          <span style={{paddingRight: 3}}>
            {applicationState.summaryCount}
          </span>
          Disclosures Shown
          <span className={styles.filterArrow}>&#9660;</span>
        </div>
      );
    }
    else {
      heading = (
        <div className={styles.heading} onClick={AdminActions.toggleFilters}>
          <span style={{paddingRight: 3}}>
            {disclosureSummaries.length}
          </span>
          <span style={{paddingRight: 3}}>of</span>
          <span style={{paddingRight: 3}}>
            {applicationState.summaryCount}
          </span>
          Disclosures Shown
          <span className={styles.filterArrow}>&#9660;</span>
        </div>
      );
    }

    return (
      <div
        className={'flexbox column'}
        style={{minHeight: '100%', overflowX: 'hidden'}}
      >
        <AppHeader
          className={`${styles.override} ${styles.header}`}
          moduleName={'Conflict Of Interest'}
        />
        <div className={classes}>
          <span className={styles.sidebar}>
            <AdminMenu />
            <DisclosureFilterSearch
              query={applicationState.filters.search}
              onChange={AdminActions.changeSearch}
              onSearch={AdminActions.doSearch}
            />
            {heading}
            <SearchFilterGroup
              className={`${styles.override} ${styles.filterGroup}`}
              filters={applicationState.filters}
              reviewerFilterValues={applicationState.reviewerFilterValues}
              lane={configState.config.lane}
              possibleStatuses={possibleStatuses}
              possibleDispositions={possibleDispositions}
              showDateSort={false}
              visible={applicationState.showFilters}
            />
          </span>
          <span className={`fill ${styles.content}`} ref="rightPanel">
            <div className={styles.header2}>
              <h2 className={styles.title}>
                {`COI ${this.context.userInfo.coiRole} DASHBOARD`}
              </h2>
            </div>
            <div style={{padding: '33px 38px'}}>
              <DisclosureTable
                sort={applicationState.sort}
                sortDirection={applicationState.sortDirection}
                page={applicationState.page}
                className={`${styles.override} ${styles.table}`}
                disclosures={disclosureSummaries}
                searchTerm={applicationState.effectiveSearchValue}
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

ListView.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};

ListView.propTypes = {
  className: React.PropTypes.string
};
