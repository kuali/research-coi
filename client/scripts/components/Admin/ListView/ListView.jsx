import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {AdminStore} from '../../../stores/AdminStore';
import {AdminActions} from '../../../actions/AdminActions';
import {SearchFilterGroup} from '../SearchFilterGroup';
import {SearchBox} from '../../SearchBox';
import {PageIndicator} from './PageIndicator';
import {KButton} from '../../KButton';
import {DisclosureTable} from './DisclosureTable';
import {FilterBox} from '../FilterBox';
import {isAfterStartDate, isBeforeEndDate, sortFunction,
        typeFilter, statusFilter} from '../AdminFilters';

export class ListView extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };

    this.state = {
      data: AdminStore.getState(),
      page: 1
    };

    this.changeQuery = this.changeQuery.bind(this);
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
    this.setState({
      page: 1
    });

    AdminActions.changeTypeFilter(newType);
  }

  changeQuery(newQuery) {
    this.setState({
      page: 1
    });

    AdminActions.changeQuery(newQuery);
  }

  advancePages() {
    // server side paging will go here
  }

  goBackPage() {
    // server side paging will go here
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        position: 'relative'
      },
      disclosures: {
        overflow: 'auto'
      },
      paging: {
        backgroundColor: '#202020',
        minHeight: 100
      },
      pagingButton: {
        padding: '7px 17px',
        backgroundColor: '#2E2E2E',
        color: 'white',
        border: 0,
        width: 114
      },
      buttonSymbol: {
        fontSize: 50
      },
      buttonText: {
        fontSize: 14,
        fontWeight: '300',
        padding: '5px 0',
        textAlign: 'center'
      },
      nextButton: {
        float: 'right'
      },
      filterGroup: {
        position: 'absolute',
        transform: this.state.data.applicationState.showFiltersOnMobile ? 'translateX(-0%)' : 'translateX(-100%)',
        transition: 'transform .3s ease-out',
        width: '100%',
        height: '100%'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);
    return (
      <div className="flexbox fill column" style={merge(styles.container, this.props.style)}>
        <SearchFilterGroup style={styles.filterGroup} filters={this.state.applicationState.filters}/>

        <FilterBox style={styles.filterBox} count={this.state.data.disclosureSummaries.length} />

        <div className="fill" style={styles.disclosures}>
          <DisclosureTable
            sort={this.state.sort}
            sortDirection={this.state.sortDirection}
            page={this.state.page}
            disclosures={this.state.data.disclosureSummaries} />
        </div>

        <div style={styles.paging}>
          <button style={styles.pagingButton}>
            <div style={styles.buttonSymbol}>&lt;</div>
            <div style={styles.buttonText}>PREVIOUS</div>
          </button>
          <button style={merge(styles.pagingButton, styles.nextButton)}>
            <div style={styles.buttonSymbol}>&gt;</div>
            <div style={styles.buttonText}>NEXT</div>
          </button>
        </div>
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
      },
      sidebar: {
        width: 225,
        backgroundColor: '#202020'
      },
      content: {
        display: 'inline-block',
        padding: '15px 30px',
        borderTop: '6px solid ' + window.config.colors.three,
        backgroundColor: '#E8E9E6'
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
        backgroundColor: window.config.colors.three
      },
      nextPage: {
        padding: '7px 20px',
        backgroundColor: window.config.colors.two
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

    let filtered = this.state.data.disclosureSummaries
      .filter(isAfterStartDate(this.state.data.applicationState.filters.date))
      .filter(isBeforeEndDate(this.state.data.applicationState.filters.date))
      .filter(typeFilter(this.state.data.applicationState.filters.type))
      .filter(statusFilter(this.state.data.applicationState.filters.status))
      .sort(sortFunction(this.state.data.applicationState.sortDirection));

    let styles = merge(this.commonStyles, desktopStyles);
    return (

      <div className="flexbox fill row" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <SearchFilterGroup style={styles.filterGroup}
          filters={this.state.data.applicationState.filters}
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
            <SearchBox style={styles.searchbox} value={this.state.data.applicationState.query} onChange={this.changeQuery} />
          </div>

          <div>
            <DisclosureTable
              sort={this.state.data.applicationState.sort}
              sortDirection={this.state.data.applicationState.sortDirection}
              page={this.state.data.applicationState.page}
              style={styles.table}
              disclosures={filtered} />
          </div>
        </span>
      </div>
    );
  }
}
