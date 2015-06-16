import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {SearchFilter} from './SearchFilter';
import {AdminActions} from '../../actions/AdminActions';

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
        label: 'DISPOSITION'
      },
      {
        label: 'STATUS'
      },
      {
        label: 'SUBMITTED BY'
      },
      {
        label: 'REPORTER NAME'
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
        display: 'flex',
        flexDirection: 'column'
      },
      transparent: {
        height: 34
      },
      filters: {
        flex: 1,
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
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.transparent} />
        <div style={styles.filters}>
          {searchFilters}
        </div>
        <div style={styles.doneButton} onClick={this.hideMobileFilters}>DONE</div>
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: '#2E2E2E',
        padding: '12px 42px'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let searchFilters = this.filters.map((filter) => {
      return (
        <SearchFilter key={filter.label}>
          {filter.label}
        </SearchFilter>
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        {searchFilters}
      </div>
    );  
  }
}