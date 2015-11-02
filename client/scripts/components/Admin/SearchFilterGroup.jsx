/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

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
