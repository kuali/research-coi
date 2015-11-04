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
import {GreyButton} from '../GreyButton';
import {AdminActions} from '../../actions/AdminActions';
import DisclosureFilter from './DisclosureFilter';
import DoneWithFilterButton from './DoneWithFilterButton';
import PISearchBox from './PISearchBox';

export class DisclosureFilterByPI extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'SUBMITTED BY';
  }

  clear(e) {
    AdminActions.clearSubmittedByFilter();
    e.stopPropagation();
  }

  piSelected(piName) {
    AdminActions.setSubmittedByFilter(piName);
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    let styles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black',
        padding: '10px 0 10px 10px',
        width: 300
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
      searchBoxDiv: {
        borderBottom: '1px solid #AAA',
        paddingBottom: 10,
        marginBottom: 10
      },
      x: {
        fontSize: 15,
        paddingRight: 8
      }
    };

    return (
      <div style={styles.container}>
        <DoneWithFilterButton onClick={this.close} />

        <label htmlFor="pisearchbox" style={{fontSize: 13}}>SEARCH FOR NAME:</label>

        <div style={styles.searchBoxDiv}>
          <PISearchBox value={this.props.piName} onSelected={this.piSelected} />
        </div>

        <GreyButton style={styles.clearButton} onClick={this.clear}>
          <i className="fa fa-times" style={styles.x}></i>
          CLEAR FILTER
        </GreyButton>
      </div>
    );
  }
}
