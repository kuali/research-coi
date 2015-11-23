/* @flow */
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

import React from 'react'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';
import {DisclosureFilterByStatus} from './DisclosureFilterByStatus';
import {DisclosureFilterByDate} from './DisclosureFilterByDate';
import {DisclosureFilterByPI} from './DisclosureFilterByPI';

export default function SearchFilterGroup(props: Object): React.Element {
  let styles = {
    container: {
      backgroundColor: '#eeeeee',
      padding: '12px 0 12px 0',
      marginTop: props.visible ? 0 : -119,
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
    <div style={merge(styles.container, props.style)}>
      <DisclosureFilterByDate
        active={props.filters.date.start || props.filters.date.end}
        startDate={props.filters.date.start}
        endDate={props.filters.date.end}
        sortDirection={props.sortDirection}
        showSort={props.showDateSort}
      />
      {/*<DisclosureFilterByType
        active={props.activeTypeFilters && props.activeTypeFilters.length > 0}
        activeFilters={props.activeTypeFilters}
        possibleTypes={props.possibleTypes}
      />*/}
      <DisclosureFilterByStatus
        active={props.activeStatusFilters && props.activeStatusFilters.length > 0}
        activeFilters={props.activeStatusFilters}
        possibleStatuses={props.possibleStatuses}
      />
      <DisclosureFilterByPI
        active={props.activePIFilter}
        piName={props.activePIFilter}
      />
    </div>
  );
}
