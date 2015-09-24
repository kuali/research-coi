import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {SearchFilter} from './SearchFilter';
import {AdminActions} from '../../actions/AdminActions';
import {DisclosureFilterByType} from './DisclosureFilterByType';
import {DisclosureFilterByStatus} from './DisclosureFilterByStatus';
import {DisclosureFilterByDate} from './DisclosureFilterByDate';

export class SearchFilterGroup extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };

    this.filters = [
      {
        label: 'DATE/DATE RANGE'
      },
      {
        label: 'TYPE'
      },
      {
        label: 'STATUS'
      },
      {
        label: 'SUBMITTED BY'
      }
    ];

    this.hideMobileFilters = this.hideMobileFilters.bind(this);
  }

  hideMobileFilters() {
    AdminActions.toggleMobileFilters();
  }

  renderMobile() {
    let mobileStyles = {
      container: {
      },
      transparent: {
        height: 34
      },
      filters: {
        backgroundColor: '#3e3e3e',
        overflow: 'auto'
      },
      doneButton: {
        height: 75,
        backgroundColor: 'white',
        color: '#444',
        textAlign: 'center',
        fontWeight: 300,
        fontSize: 23,
        paddingTop: 20
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let searchFilters = this.filters.map((filter) => {
      return (
        <SearchFilter key={filter.label}>
          {filter.label}
        </SearchFilter>
      );
    });

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.transparent} />
        <div className="fill" style={styles.filters}>
          {searchFilters}
        </div>
        <div style={styles.doneButton} onClick={this.hideMobileFilters}>DONE</div>
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: '#eeeeee',
        padding: '12px 0 12px 0'
      },
      filters: {
        backgroundColor: window.config.colors.three,
        textAlign: 'right',
        color: 'white',
        width: '100%',
        position: 'relative'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);
    return (
      <div style={merge(styles.container, this.props.style)}>
        <DisclosureFilterByDate
          active={this.props.filters.date.start || this.props.filters.date.end}
          startDate={this.props.filters.date.start}
          endDate={this.props.filters.date.end}
          sortDirection={this.props.sortDirection}
          showSort={this.props.showDateSort}
        />
        <DisclosureFilterByType
          active={this.props.activeTypeFilters && this.props.activeTypeFilters.length > 0}
          activeFilters={this.props.activeTypeFilters}
          possibleTypes={this.props.possibleTypes}
        />
        <DisclosureFilterByStatus
          active={this.props.activeStatusFilters && this.props.activeStatusFilters.length > 0}
          activeFilters={this.props.activeStatusFilters}
          possibleStatuses={this.props.possibleStatuses}
        />
      </div>
    );
  }
}
