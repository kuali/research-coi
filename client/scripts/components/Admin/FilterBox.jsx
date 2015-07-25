import React from 'react/addons';
import {merge} from '../../merge';
import {FilterIcon} from '../DynamicIcons/FilterIcon';
import {AdminActions} from '../../actions/AdminActions';

export class FilterBox extends React.Component {
  constructor() {
    super();
    this.showFilters = this.showFilters.bind(this);
    this.changeQuery = this.changeQuery.bind(this);
  }

  showFilters() {
    AdminActions.toggleMobileFilters();
  }

  changeQuery() {
    AdminActions.changeQuery(this.refs.searchBox.getDOMNode().value);
  }

  render() {
    let styles = {
      container: {
        backgroundColor: '#E8E9E6',
        minHeight: 80
      },
      icon: {
        color: window.config.colors.two,
        width: '20%',
        height: 46,
        display: 'inline-block',
        marginTop: 17,
        verticalAlign: 'middle'
      },
      right: {
        padding: '8px 15px 14px 0',
        display: 'inline-block',
        width: '80%',
        verticalAlign: 'middle'
      },
      searchBox: {
        width: '100%',
        padding: 6,
        fontSize: 16,
        border: '1px solid #c0c0c0',
        borderRadius: '5',
        marginBottom: 11
      },
      disclosureCount: {
        color: window.config.colors.two,
        fontSize: 18,
        padding: '0 0 8px 12px'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <FilterIcon style={styles.icon} onClick={this.showFilters} />
        <span style={styles.right} >
          <div style={styles.disclosureCount}>
            {this.props.count} Disclosures Shown
          </div>
          <div>
            <input style={styles.searchBox} type="search" placeholder="Search..." onChange={this.changeQuery} ref="searchBox" />
          </div>
        </span>
      </div>
    );
  }
}
