import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {AdminStore} from '../../../stores/AdminStore';
import {AdminActions} from '../../../actions/AdminActions';
import {SearchFilterGroup} from '../SearchFilterGroup';
import {DisclosureTable} from './DisclosureTable';
import {DisclosureFilterSearch} from '../DisclosureFilterSearch';
import {KButton} from '../../KButton';
import ConfigStore from '../../../stores/ConfigStore';

export class ListView extends React.Component {
  constructor() {
    super();

    this.state = {
      data: AdminStore.getState()
    };

    this.changeSearch = this.changeSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  componentDidMount() {
    AdminStore.listen(this.onChange);

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
  }

  onChange() {
    this.setState({
      data: AdminStore.getState()
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

  render() {
    let styles = {
      container: {
      },
      sidebar: {
        minWidth: 300,
        backgroundColor: '#eeeeee',
        boxShadow: '2px 0px 6px #D1D1D1',
        zIndex: 9
      },
      content: {
        display: 'inline-block',
        padding: '15px 30px',
        borderTop: '6px solid #1481A3',
        backgroundColor: '#eeeeee',
        overflowY: 'auto'
      },
      table: {
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
        boxShadow: '0 0 9px #bbb'
      },
      filterGroup: {
        backgroundColor: '#49899D'
      },
      heading: {
        color: 'white',
        backgroundColor: '#2B5866',
        textAlign: 'right',
        padding: '8px 70px 8px 0',
        fontWeight: 'bold',
        fontSize: 17
      },
      loadMoreButton: {
        textAlign: 'center',
        margin: '10px 0'
      },
      loadingIndicator: {
        textAlign: 'center',
        margin: '10px 0',
        color: '#777'
      }
    };

    let filtered = this.state.data.disclosureSummaries;
    let loadMoreButton;
    if (!this.state.data.applicationState.loadedAll && !this.state.data.applicationState.loadingMore) {
      loadMoreButton = (
        <div style={styles.loadMoreButton}>
          <KButton onClick={this.loadMore}>Load more</KButton>
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

    let possibleStatuses = ConfigStore.getState().config.disclosureStatus.map(status => {
      return status.description;
    });

    let possibleTypes = ConfigStore.getState().config.disclosureTypes.map(type => {
      return type.description;
    });

    return (
      <div className="flexbox fill row" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <DisclosureFilterSearch
            query={this.state.data.applicationState.filters.search}
            onChange={this.changeSearch}
            onSearch={this.doSearch}
          />
          <div style={styles.heading} onClick={this.toggleFilters}>
            {this.state.data.applicationState.summaryCount} Disclosures Shown
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
          />
        </span>
        <span className="fill" style={styles.content} ref="rightPanel">
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
      </div>
    );
  }
}
