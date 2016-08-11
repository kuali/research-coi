/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {formatDate} from '../../../../format-date';
import {getAdminDisclosureStatusString} from '../../../../stores/config-store';
import {Link} from 'react-router';

export class DisclosureTableRow extends React.Component {
  highlightSearchTerm(value) {
    const start = value.toLowerCase().indexOf(this.props.searchTerm.toLowerCase());
    if (start >= 0) {
      const matchingValue = value.substr(start, this.props.searchTerm.length);
      return (
        <span>
          <span style={{display: 'inline'}}>{String(value.substr(0, start))}</span>
          <span className={'highlight'}>
            {matchingValue}
          </span>
          <span style={{display: 'inline'}}>{value.substr(start + this.props.searchTerm.length)}</span>
        </span>
      );
    }

    return value;
  }

  render() {
    let dateToShow;
    if (this.props.revisedDate !== null) {
      dateToShow = `${formatDate(this.props.revisedDate)} (revised)`;
    }
    else {
      dateToShow = formatDate(this.props.submittedDate);
    }

    const disclosureStatus = getAdminDisclosureStatusString(
      this.context.configState,
      this.props.statusCd,
      this.props.configId
    );
    return (
      <div role="row" className={classNames(styles.container, this.props.className)}>
        <span role="gridcell" className={classNames(styles.value, styles.firstColumn)}>
          <Link to={{pathname: `/coi/admin/detailview/${this.props.id}/${this.props.statusCd}`}}>
            {this.highlightSearchTerm(this.props.submittedBy)}
          </Link>
        </span>
        {/*<span role="gridcell" className={styles.value}>
          {this.highlightSearchTerm(this.props.type)}
        </span>*/}
        <span role="gridcell" className={styles.value}>
          {disclosureStatus}
        </span>
        <span role="gridcell" className={classNames(styles.value, styles.lastColumn)}>
          {dateToShow}
        </span>
      </div>
    );
  }
}

DisclosureTableRow.contextTypes = {
  configState: React.PropTypes.object
};
