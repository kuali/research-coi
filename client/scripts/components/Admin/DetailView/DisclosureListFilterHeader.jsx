import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureListFilter} from '../DisclosureListFilter';
import {DisclosureFilterByType} from '../DisclosureFilterByType';
import {DisclosureFilterByDate} from '../DisclosureFilterByDate';
import {DisclosureFilterByStatus} from '../DisclosureFilterByStatus';
import {DisclosureFilterSearch} from '../DisclosureFilterSearch';

export class DisclosureListFilterHeader extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.state = {
      showFilters: true
    };

    this.toggleFilters = this.toggleFilters.bind(this);
  }

  toggleFilters() {
    this.setState({showFilters: !this.state.showFilters});
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
      },
      heading: {
        fontWeight: 'bold',
        textAlign: 'right',
        backgroundColor: '#1481A3',
        color: 'white',
        padding: 10,
        paddingRight: 100,
        cursor: 'pointer',
        fontSize: 17
      },
      filters: {
        backgroundColor: '#49899D',
        textAlign: 'right',
        color: 'white',
        width: '100%',
        position: 'relative',
        display: this.state.showFilters ? 'inline-block' : 'none'
      },
      filter: {
        padding: 7,
        paddingRight: 100,
        fontSize: '.8em',
        color: 'white'
      },
      arrows: {
        fontSize: 7,
        marginLeft: 4,
        verticalAlign: 'middle'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.styles)}>
        <DisclosureFilterSearch query={this.props.query} filters={this.props.filters} />
        <div style={styles.heading} onClick={this.toggleFilters}>
          {this.props.count} Disclosures Shown
          {this.state.showFilters ? <span style={styles.arrows}>&#9660;</span> : <span style={styles.arrows}>&#9654;</span>}
        </div>
        <div style={styles.filters}>
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
          <DisclosureListFilter style={styles.filter} label='DEPARTMENT'>
            <DisclosureFilterByUnit />
          </DisclosureListFilter>
        </div>
      </div>
    );
  }
}
