import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';
import {DisclosureFilterByStatus} from './DisclosureFilterByStatus';
import {DisclosureFilterByDate} from './DisclosureFilterByDate';
import {DisclosureFilterByPI} from './DisclosureFilterByPI';

export class SearchFilterGroup extends React.Component {
  constructor() {
    super();

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
  }

  render() {
    let styles = {
      container: {
        backgroundColor: '#eeeeee',
        padding: '12px 0 12px 0',
        marginTop: this.props.visible ? 0 : -119,
        transition: 'margin-top .1s ease-in-out'
      },
      filters: {
        backgroundColor: window.config.colors.three,
        textAlign: 'right',
        color: 'white',
        width: '100%',
        position: 'relative'
      }
    };
    return (
      <div style={merge(styles.container, this.props.style)}>
        <DisclosureFilterByDate
          active={this.props.filters.date.start || this.props.filters.date.end}
          startDate={this.props.filters.date.start}
          endDate={this.props.filters.date.end}
          sortDirection={this.props.sortDirection}
          showSort={this.props.showDateSort}
        />
        {/*<DisclosureFilterByType
          active={this.props.activeTypeFilters && this.props.activeTypeFilters.length > 0}
          activeFilters={this.props.activeTypeFilters}
          possibleTypes={this.props.possibleTypes}
        />*/}
        <DisclosureFilterByStatus
          active={this.props.activeStatusFilters && this.props.activeStatusFilters.length > 0}
          activeFilters={this.props.activeStatusFilters}
          possibleStatuses={this.props.possibleStatuses}
        />
        <DisclosureFilterByPI
          active={this.props.activePIFilter}
          piName={this.props.activePIFilter}
        />
      </div>
    );
  }
}
