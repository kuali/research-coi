import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {SearchFilter} from './SearchFilter';

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
  }

  renderMobile() {
    let mobileStyles = {
      container: {
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
        Search filters!
      </span>
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

    let searchFilters = [];
    this.filters.forEach((filter) => {
      searchFilters.push(
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