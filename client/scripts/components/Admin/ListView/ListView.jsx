import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {AdminStore} from '../../../stores/AdminStore';
import {AdminActions} from '../../../actions/AdminActions';
import {SearchFilterGroup} from '../SearchFilterGroup';
import {SearchBox} from '../../SearchBox';
import {DisclosureTable} from './DisclosureTable';

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
        backgroundColor: '#eeeeee'
      },
      searchbox: {
        width: 300
      },
      table: {
        marginTop: 21,
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
        boxShadow: '0 0 9px #bbb'
      },
      filterGroup: {
        marginTop: 90
      }
    };

    let filtered = this.state.data.disclosureSummaries;

    return (
      <div className="flexbox fill row" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <SearchFilterGroup
            style={styles.filterGroup}
            filters={this.state.data.applicationState.filters}
            possibleStatuses={['In progress', 'Routed for Review', 'Approved', 'Disapproved']}
            possibleTypes={['Manual Disclosure', 'Annual Disclosure', 'Project Disclosure', 'Travel Log']}
            activeStatusFilters={this.state.data.applicationState.filters.status}
            activeTypeFilters={this.state.data.applicationState.filters.type}
            showDateSort={false}
          />

        </span>
        <span className="fill" style={styles.content}>
          <div>
            <SearchBox
              style={styles.searchbox}
              value={this.state.data.applicationState.filters.search}
              onChange={this.changeSearch}
              onSearch={this.doSearch}
            />
          </div>

          <div>
            <DisclosureTable
              sort={this.state.data.applicationState.sort}
              sortDirection={this.state.data.applicationState.sortDirection}
              page={this.state.data.applicationState.page}
              style={styles.table}
              disclosures={filtered}
              searchTerm={this.state.data.applicationState.effectiveSearchValue}
            />
          </div>
        </span>
      </div>
    );
  }
}
