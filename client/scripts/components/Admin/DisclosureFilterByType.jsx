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
import {GreyButton} from '../GreyButton';
import {AdminActions} from '../../actions/AdminActions';
import DisclosureFilter from './DisclosureFilter';
import DoneWithFilterButton from './DoneWithFilterButton';

export class DisclosureFilterByType extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'TYPE';

    this.toggleFilter = this.toggleFilter.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  clear(e) {
    AdminActions.clearTypeFilter();
    e.stopPropagation();
  }

  toggleFilter(evt) {
    let index = Number(evt.target.id.replace('typeFilt', ''));
    AdminActions.toggleTypeFilter(this.props.possibleTypes[index]);
  }

  isChecked(value) {
    return this.props.activeFilters.find(filter => {
      return filter === value;
    }) !== undefined;
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    let styles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black'
      },
      checkbox: {
        textAlign: 'left',
        padding: 10
      },
      clearButton: {
        backgroundColor: '#DFDFDF',
        color: 'black',
        borderBottom: '3px solid #717171',
        float: 'right',
        padding: '4px 7px',
        width: 135,
        margin: '10px 0'
      },
      x: {
        fontSize: 15,
        paddingRight: 8
      }
    };

    let options = this.props.possibleTypes.map((type, index) => {
      let id = 'typeFilt' + index;
      return (
        <div style={styles.checkbox} key={type}>
          <input
            id={id}
            type="checkbox"
            checked={this.isChecked(type)}
            onChange={this.toggleFilter}
          />
          <label htmlFor={id}>{type}</label>
        </div>
      );
    });

    return (
      <div style={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        {options}
        <GreyButton style={styles.clearButton} onClick={this.clear}>
          <i className="fa fa-times" style={styles.x}></i>
          CLEAR FILTER
        </GreyButton>
      </div>
    );
  }
}
