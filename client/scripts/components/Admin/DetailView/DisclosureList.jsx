import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureListItem} from './DisclosureListItem';
import {DisclosureFilterSearch} from '../DisclosureFilterSearch';
import {SearchFilterGroup} from '../SearchFilterGroup';
import {AdminActions} from '../../../actions/AdminActions';
import {KButton} from '../../KButton';
import ConfigStore from '../../../stores/ConfigStore';

export class DisclosureList extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    let theList = React.findDOMNode(this.refs.theList);
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

  loadMore() {
    AdminActions.loadMore();
  }

  doSearch() {
    AdminActions.doSearch();
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
        backgroundColor: '#e0e0e0',
        borderLeft: '1px solid #6d6d6d',
        borderRight: '1px solid #6d6d6d',
        verticalAlign: 'top',
        boxShadow: '3px 0px 6px #CCC',
        transition: 'width .3s ease-in-out',
        zIndex: 2
      },
      list: {
        listStyleType: 'none',
        marginTop: 0,
        padding: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        width: 320
      },
      filterGroup: {
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0'
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
      filterArrow: {
        fontSize: 6,
        verticalAlign: 'top',
        margin: '7px 0 0 7px',
        transition: 'transform .1s linear',
        transform: this.props.showFilters ? 'rotateZ(0deg)' : 'rotateZ(180deg)'
      }
    };

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
        <div style={styles.loadMoreButton}>
          <KButton onClick={this.loadMore}>Load more</KButton>
        </div>
      );
    }

    let loadingIndicator;
    if (this.props.loadingMore) {
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
    if (ConfigStore.getState().config.disclosureTypes) {
      ConfigStore.getState().config.disclosureTypes.map(type => {
        return type.description;
      });
    }

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={{width: 320}}>
          <DisclosureFilterSearch
            query={this.props.filters.search}
            onChange={this.changeSearch}
            onSearch={this.doSearch}
          />
          <div style={styles.heading} onClick={this.toggleFilters}>
            <span style={{paddingRight: 3}}>
              {this.props.count}
            </span>
            Disclosures Shown
            <span style={styles.filterArrow}>&#9660;</span>
          </div>
          <SearchFilterGroup
            style={styles.filterGroup}
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
        <ul className="fill" style={styles.list} ref="theList">
          {disclosuresJsx}

          {loadMoreButton}
          {loadingIndicator}
        </ul>
      </div>
    );
  }
}
