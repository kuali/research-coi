import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureListItem} from './DisclosureListItem';
import {DisclosureListFilterHeader} from './DisclosureListFilterHeader';

export class DisclosureList extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
    this.state = {};
  }

  shouldComponentUpdate() { return true; }

  renderMobile() {
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: '#e0e0e0',
        borderLeft: '1px solid #6d6d6d',
        borderRight: '1px solid #6d6d6d',
        verticalAlign: 'top'
      },
      list: {
        listStyleType: 'none',
        marginTop: 0,
        padding: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%'
      },
      search: {
        backgroundColor: '#cdcdcd',
        height: 50
      },
      filter: {
        backgroundColor: '#5d5d5d'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosures = [];
    let disclosuresJsx;
    let selectedId = this.props.selected;
    if (this.props.summaries) {
      disclosures = this.props.summaries;
    }

    disclosuresJsx = disclosures.map(function(disclosure) {
      return (
        <DisclosureListItem
          key={disclosure.id}
          disclosure={disclosure}
          selected={disclosure.id === selectedId}
        />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        <DisclosureListFilterHeader
          count={disclosures.length}
          styles={styles.filter}
          query={this.props.query}
          filters={this.props.filters}
          sortDirection={this.props.sortDirection}
        />
        <ul className="fill" style={styles.list}>
          {disclosuresJsx}
        </ul>
      </div>
    );
  }
}
