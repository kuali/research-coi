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
import {DisclosureListItem} from '../DisclosureListItem';
import {DisclosureFilterSearch} from '../../DisclosureFilterSearch';
import SearchFilterGroup from '../../SearchFilterGroup';
import {AdminActions} from '../../../../actions/AdminActions';
import UserInfoStore from '../../../../stores/UserInfoStore';
import {BlueButton} from '../../../BlueButton';
import ConfigStore from '../../../../stores/ConfigStore';
import AdminMenu from '../../../AdminMenu';

export class DisclosureList extends React.Component {
  constructor() {
    super();
  }

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

    const possibleStatuses = [
      {code: 2, label: ConfigStore.getAdminDisclosureStatusString(2)},
      {code: 3, label: ConfigStore.getAdminDisclosureStatusString(3)},
      {code: 4, label: ConfigStore.getAdminDisclosureStatusString(4)},
      {code: 5, label: ConfigStore.getAdminDisclosureStatusString(5)},
      {code: 6, label: ConfigStore.getAdminDisclosureStatusString(6)}
    ];

    const possibleTypes = [];
    if (ConfigStore.getState().config.disclosureTypes) {
      ConfigStore.getState().config.disclosureTypes.map(type => {
        return type.description;
      });
    }

    const classes = classNames(
      'flexbox',
      'column',
      styles.container,
      this.props.className,
      {[styles.showFilters]: this.props.showFilters}
    );

    return (
      <div className={classes}>
        <AdminMenu role={UserInfoStore.getState().userInfo.coiRole} style={{padding: '32px 0px'}} />
        <div style={{width: 320}}>
          <DisclosureFilterSearch
            query={this.props.filters.search}
            onChange={this.changeSearch}
            onSearch={AdminActions.doSearch}
          />
          <div className={styles.heading} onClick={AdminActions.toggleFilters}>
            <span style={{paddingRight: 3}}>
              {this.props.count}
            </span>
            Disclosures Shown
            <span className={styles.filterArrow}>&#9660;</span>
          </div>
          <SearchFilterGroup
            className={`${styles.override} ${styles.filterGroup}`}
            filters={this.props.filters}
            possibleStatuses={possibleStatuses}
            possibleTypes={possibleTypes}
            activeStatusFilters={this.props.filters.status}
            activeTypeFilters={this.props.filters.type}
            activePIFilter={this.props.filters.submittedBy}
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
