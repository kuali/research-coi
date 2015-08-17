import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {FilterType} from './FilterType';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {DisclosureTable} from './DisclosureTable';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {SearchBox} from '../../SearchBox';

const DISCLOSURE_TYPE = {
  PROJECT: '3',
  ANNUAL: '2',
  ALL: 'ALL'
};

export class Archive extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };

    let storeState = DisclosureStore.getState();
    this.state = {
      applicationState: storeState.applicationState,
      archivedDisclosures: storeState.archivedDisclosures
    };

    this.onChange = this.onChange.bind(this);
    this.changeQuery = this.changeQuery.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.loadArchivedDisclosures();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = DisclosureStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      archivedDisclosures: storeState.archivedDisclosures
    });
  }

  shouldComponentUpdate() { return true; }

  changeQuery(newQuery) {
    DisclosureActions.changeArchivedQuery(newQuery);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        width: '100%',
        background: '#eeeeee'
      },
      sidebar: {
        minWidth: 300,
        display: 'inline-block',
        backgroundColor: '#eeeeee',
        verticalAlign: 'top',
        paddingTop: 125,
        boxShadow: '2px 1px 8px #D5D5D5'
      },
      content: {
        display: 'inline-block',
        verticalAlign: 'top'
      },
      header: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3',
        boxShadow: '0 2px 8px #D5D5D5'
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        textTransform: 'uppercase',
        fontWeight: 300,
        color: '#444'
      },
      table: {
        margin: '30px 30px'
      },
      searchbox: {
        width: 300,
        margin: '30px'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let query = this.state.applicationState.archiveQuery;
    if (query) {
      query = query.toLowerCase();
    }
    let disclosures = this.state.archivedDisclosures.filter(
      disclosure => {
        if (query) {
          return disclosure.title.toLowerCase().indexOf(query) === 0;
        }
        else {
          return true;
        }
      }
    );
    if (this.state.applicationState.archiveFilter !== DISCLOSURE_TYPE.ALL) {
      disclosures = disclosures.filter(
        disclosure => {
          return disclosure.type.toString() === this.state.applicationState.archiveFilter;
        }
      );
    }

    return (
      <span className="flexbox row fill" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>

          <FilterType type={DISCLOSURE_TYPE.ALL} active={this.state.applicationState.archiveFilter === DISCLOSURE_TYPE.ALL}>
            ALL DISCLOSURES
          </FilterType>
          <FilterType type={DISCLOSURE_TYPE.PROJECT} active={this.state.applicationState.archiveFilter === DISCLOSURE_TYPE.PROJECT}>
            PROJECT DISCLOSURES
          </FilterType>
          <FilterType type={DISCLOSURE_TYPE.ANNUAL} active={this.state.applicationState.archiveFilter === DISCLOSURE_TYPE.ANNUAL}>
            ANNUAL DISCLOSURES
          </FilterType>
        </span>
        <span className="fill" style={styles.content}>
          <div style={styles.header}>
            <h2 style={styles.heading}>Disclosure Archive</h2>
          </div>

          <div>
            <SearchBox placeholder="Project Title" style={styles.searchbox} value={this.state.applicationState.archivedQuery} onChange={this.changeQuery} />
          </div>

          <div style={styles.table}>
            <DisclosureTable
              sortField={this.state.applicationState.archiveSortField}
              sortDirection={this.state.applicationState.archiveSortDirection}
              disclosures={disclosures}
            />
          </div>
        </span>
      </span>
    );
  }
}
