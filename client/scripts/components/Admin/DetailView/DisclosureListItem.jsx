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
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import ConfigStore from '../../../stores/ConfigStore';
import {Link} from 'react-router';

export class DisclosureListItem extends React.Component {
  constructor() {
    super();

    this.highlightSearchTerm = this.highlightSearchTerm.bind(this);
  }

  highlightSearchTerm(value) {
    let start = value.toLowerCase().indexOf(this.props.searchTerm.toLowerCase());
    if (start >= 0) {
      let matchingValue = value.substr(start, this.props.searchTerm.length);
      return (
        <span>
          <span style={{display: 'inline'}}>{String(value.substr(0, start))}</span>
          <span className="highlight">
            {matchingValue}
          </span>
          <span style={{display: 'inline'}}>{value.substr(start + this.props.searchTerm.length)}</span>
        </span>
      );
    }

    return value;
  }

  render() {
    let styles = {
      container: {
        borderBottom: '1px solid #8C8C8C',
        borderRight: '1px solid #8C8C8C',
        padding: 6,
        paddingLeft: 40,
        fontSize: '.9em',
        backgroundColor: this.props.selected ? (window.colorBlindModeOn ? 'white' : '#E1EEEF') : 'white',
        cursor: 'pointer'
      },
      disclosureType: {
        fontWeight: 'bold'
      },
      submittedBy: {
        fontWeight: 'bold'
      }
    };

    let disclosure = this.props.disclosure;
    let dateToShow;
    if (disclosure.revised_date) {
      dateToShow = (
        <div>{formatDate(disclosure.revised_date)} - Revised</div>
      );
    }
    else {
      dateToShow = (
        <div>{formatDate(disclosure.submitted_date)} - Submitted for Approval</div>
      );
    }

    return (
      <Link to={`/coi/admin/detailview/${this.props.disclosure.id}/${disclosure.statusCd}`}>
        <li style={merge(styles.container, this.props.style)}>
          {/*<div style={styles.disclosureType}>
            {this.highlightSearchTerm(disclosure.type)}
          </div>*/}
          <div style={styles.submittedBy}>{this.highlightSearchTerm(disclosure.submitted_by)}</div>
          {dateToShow}
          <div>{ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}</div>
        </li>
      </Link>
    );
  }
}
