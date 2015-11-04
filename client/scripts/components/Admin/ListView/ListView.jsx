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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {AdminStore} from '../../../stores/AdminStore';
import {AdminActions} from '../../../actions/AdminActions';
import {SearchFilterGroup} from '../SearchFilterGroup';
import {DisclosureTable} from './DisclosureTable';
import {DisclosureFilterSearch} from '../DisclosureFilterSearch';
import {BlueButton} from '../../BlueButton';
import ConfigStore from '../../../stores/ConfigStore';

export class ListView extends React.Component {
  constructor() {
    super();

    this.state = {
      data: AdminStore.getState(),
      config: ConfigStore.getState().config
    };

    this.changeSearch = this.changeSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  componentDidMount() {
    AdminStore.listen(this.onChange);
    ConfigStore.listen(this.onChange);

    let rightPanel = React.findDOMNode(this.refs.rightPanel);
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
      config: ConfigStore.getState().config
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
    let styles = {
      container: {
        minHeight: 100
      },
      sidebar: {
        minWidth: 300,
        backgroundColor: '#eeeeee',
        boxShadow: '2px 0px 6px #D1D1D1',
        zIndex: 9
      },
      content: {
        display: 'inline-block',
        backgroundColor: '#eeeeee',
        overflowY: 'auto'
      },
      table: {
        backgroundColor: 'white',
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: '0 0 9px #bbb'
      },
      filterGroup: {
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0'
      },
      header: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3',
        boxShadow: '0 1px 6px #D1D1D1'
      },
      title: {
        fontSize: '33px',
        margin: '0 0 0 0',
        textTransform: 'uppercase',
        fontWeight: 300,
        color: '#525252'
      },
      heading: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        backgroundColor: '#EEEEEE',
        textAlign: 'right',
        padding: '8px 70px 8px 0',
        fontWeight: 'bold',
        fontSize: 17,
        position: 'relative',
        zIndex: 2,
        borderRight: '1px solid #DDD',
        cursor: 'pointer'
      },
      loadMoreButton: {
        textAlign: 'center',
        margin: '10px 0'
      },
      loadingIndicator: {
        textAlign: 'center',
        margin: '10px 0',
        color: '#777'
      },
      navigation: {
        width: 220,
        padding: '0 30px 0 40px',
        whiteSpace: 'nowrap'
      },
      configIcon: {
        color: window.colorBlindModeOn ? 'black' : '#F57C00',
        verticalAlign: 'middle',
        fontSize: 27,
        paddingRight: 15
      },
      configLabel: {
        whiteSpace: 'normal',
        verticalAlign: 'middle',
        fontSize: 15
      },
      filterArrow: {
        fontSize: 6,
        verticalAlign: 'top',
        margin: '7px 0 0 7px',
        transition: 'transform .1s linear',
        transform: this.state.data.applicationState.showFilters ? 'rotateZ(0deg)' : 'rotateZ(180deg)'
      }
    };

    let filtered = this.state.data.disclosureSummaries;
    let loadMoreButton;
    if (!this.state.data.applicationState.loadedAll && !this.state.data.applicationState.loadingMore) {
      loadMoreButton = (
        <div style={styles.loadMoreButton}>
          <BlueButton onClick={this.loadMore}>Load more</BlueButton>
        </div>
      );
    }

    let loadingIndicator;
    if (this.state.data.applicationState.loadingMore) {
      loadingIndicator = (
        <div style={styles.loadingIndicator}>
          <span>Loading more...</span>
        </div>
      );
    }

    let possibleStatuses = [
      {code: 2, label: ConfigStore.getAdminDisclosureStatusString(2)},
      {code: 3, label: ConfigStore.getAdminDisclosureStatusString(3)},
      {code: 4, label: ConfigStore.getAdminDisclosureStatusString(4)},
      {code: 5, label: ConfigStore.getAdminDisclosureStatusString(5)},
      {code: 6, label: ConfigStore.getAdminDisclosureStatusString(6)}
    ];

    let possibleTypes = [];
    if (this.state.config.disclosureTypes) {
      this.state.config.disclosureTypes.map(type => {
        return type.description;
      });
    }

    return (
      <div className="flexbox fill row" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <DisclosureFilterSearch
            query={this.state.data.applicationState.filters.search}
            onChange={this.changeSearch}
            onSearch={this.doSearch}
          />
          <div style={styles.heading} onClick={this.toggleFilters}>
            <span style={{paddingRight: 3}}>
              {this.state.data.applicationState.summaryCount}
            </span>
            Disclosures Shown
            <span style={styles.filterArrow}>&#9660;</span>
          </div>
          <SearchFilterGroup
            style={styles.filterGroup}
            filters={this.state.data.applicationState.filters}
            possibleStatuses={possibleStatuses}
            possibleTypes={possibleTypes}
            activeStatusFilters={this.state.data.applicationState.filters.status}
            activeTypeFilters={this.state.data.applicationState.filters.type}
            activePIFilter={this.state.data.applicationState.filters.submittedBy}
            showDateSort={false}
            visible={this.state.data.applicationState.showFilters}
          />
        </span>
        <span className="fill" style={styles.content} ref="rightPanel">
          <div style={styles.header}>
            <h2 style={styles.title}>COI ADMIN DASHBOARD</h2>
          </div>
          <div className="flexbox row" style={{padding: '33px 38px'}}>
            <span className="fill">
              <DisclosureTable
                sort={this.state.data.applicationState.sort}
                sortDirection={this.state.data.applicationState.sortDirection}
                page={this.state.data.applicationState.page}
                style={styles.table}
                disclosures={filtered}
                searchTerm={this.state.data.applicationState.effectiveSearchValue}
              />
              {loadMoreButton}
              {loadingIndicator}
            </span>
            <span style={styles.navigation}>
              <a href="config">
                <i className="fa fa-arrow-circle-right" style={styles.configIcon}></i>
                <span style={styles.configLabel}>COI CONFIGURATION</span>
              </a>
            </span>
          </div>
        </span>
      </div>
    );
  }
}
