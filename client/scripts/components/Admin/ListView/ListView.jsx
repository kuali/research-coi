import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {AdminStore} from '../../../stores/AdminStore';
import {AdminActions} from '../../../actions/AdminActions';
import {SearchFilterGroup} from '../SearchFilterGroup';
import {SearchBox} from '../../SearchBox';
import {PageIndicator} from './PageIndicator';
import {KButton} from '../../KButton';
import {DisclosureTable} from './DisclosureTable';

export class ListView extends React.Component {
  constructor() {
    super();
    this.commonStyles = {
    };

    this.state = {
      data: AdminStore.getState()
    };

    this.changeSearch = this.changeSearch.bind(this);
    this.onChange = this.onChange.bind(this);
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

  changeType(newType) {
    AdminActions.changeTypeFilter(newType);
  }

  changeSearch(newSearch) {
    AdminActions.changeSearch(newSearch);
  }

  advancePages() {
    // server side paging will go here
  }

  goBackPage() {
    // server side paging will go here
  }

  render() {
    let desktopStyles = {
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
      pageButton: {
        height: 40,
        marginLeft: 10,
        width: 'initial',
        color: 'white'
      },
      previousPage: {
        padding: '7px 20px 7px 16px',
        backgroundColor: '#1481A3'
      },
      nextPage: {
        padding: '7px 20px',
        backgroundColor: '#1481A3'
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
      },
      pageButtons: {
        whiteSpace: 'nowrap',
        'float': 'right'
      }
    };

    let filtered = this.state.data.disclosureSummaries;

    let styles = merge(this.commonStyles, desktopStyles);
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
            <span style={styles.pageButtons}>
              <PageIndicator
                current={this.state.page}
                total={this.state.disclosures ? Math.ceil(this.state.disclosures.length / 10) : 1}
              />

              <KButton style={merge(styles.pageButton, styles.previousPage)} onClick={this.goBackPage}>&lt; PREVIOUS PAGE</KButton>
              <KButton style={merge(styles.pageButton, styles.nextPage)} onClick={this.advancePages}>NEXT PAGE &gt;</KButton>
            </span>
            <SearchBox style={styles.searchbox} value={this.state.data.applicationState.filters.search} onChange={this.changeSearch} />
          </div>

          <div>
            <DisclosureTable
              sort={this.state.data.applicationState.sort}
              sortDirection={this.state.data.applicationState.sortDirection}
              page={this.state.data.applicationState.page}
              style={styles.table}
              disclosures={filtered}
              searchTerm={this.state.data.applicationState.filters.search}
            />
          </div>
        </span>
      </div>
    );
  }
}
