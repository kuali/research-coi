import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {SearchFilter} from './SearchFilter';
import {AdminActions} from '../../actions/AdminActions';
import {DisclosureFilterByType} from './DisclosureFilterByType';
import {DisclosureFilterByStatus} from './DisclosureFilterByStatus';
import {DisclosureFilterByDate} from './DisclosureFilterByDate';
import {DisclosureListFilter} from './DisclosureListFilter';

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
        backgroundColor: '#2E2E2E',
        padding: '12px 42px'
      },
      filters: {
        backgroundColor: window.config.colors.three,
        textAlign: 'right',
        color: 'white',
        width: '100%',
        position: 'relative'
      },
      filter: {
        padding: 7,
        paddingRight: 100,
        fontSize: '.8em',
        color: 'white'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <DisclosureListFilter style={styles.filter} label='DATE/DATE RANGE'>
            <DisclosureFilterByDate
              startDate={this.props.filters.date.start}
              endDate={this.props.filters.date.end}
              sortDirection={this.props.sortDirection}
            />
        </DisclosureListFilter>
        <DisclosureListFilter style={styles.filter} label='TYPE' >
              <DisclosureFilterByType
                annual={this.props.filters.type.annual}
                project={this.props.filters.type.project}
              />
        </DisclosureListFilter>
        <DisclosureListFilter style={styles.filter} label='STATUS'>
            <DisclosureFilterByStatus
              inProgress={this.props.filters.status.inProgress}
              awaitingReview={this.props.filters.status.awaitingReview}
              revisionNecessary={this.props.filters.status.revisionNecessary}
            />
        </DisclosureListFilter>
      </div>
    );
  }
}
