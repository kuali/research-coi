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

export class DisclosureTableRow extends React.Component {
  highlightSearchTerm(value) {
    const start = value.toLowerCase().indexOf(this.props.searchTerm.toLowerCase());
    if (start >= 0) {
      const matchingValue = value.substr(start, this.props.searchTerm.length);
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
    const styles = {
      container: {
        display: 'table-row',
        height: 43
      },
      value: {
        padding: '12px 0 0 0',
        display: 'table-cell',
        borderBottom: '1px solid #AAA',
        fontSize: 15,
        textOverflow: 'ellipsis'
      },
      firstColumn: {
        padding: '12px 0 0 50px'
      },
      lastColumn: {
        padding: '12px 50px 0 0'
      }
    };

    return (
      <div role="row" style={merge(styles.container, this.props.style)}>
        <span role="gridcell" style={merge(styles.value, styles.firstColumn)}>
          <Link to={`/coi/admin/detailview/${this.props.id}/${this.props.statusCd}`}>
            {this.highlightSearchTerm(this.props.submittedBy)}
          </Link>
        </span>
        {/*<span role="gridcell" style={styles.value}>
          {this.highlightSearchTerm(this.props.type)}
        </span>*/}
        <span role="gridcell" style={styles.value}>
          {ConfigStore.getAdminDisclosureStatusString(this.props.statusCd)}
        </span>
        <span role="gridcell" style={merge(styles.value, styles.lastColumn)}>
          {formatDate(this.props.submittedDate)}
        </span>
      </div>
    );
  }
}
