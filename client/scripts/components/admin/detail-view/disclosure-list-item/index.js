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

export class DisclosureListItem extends React.Component {
  constructor() {
    super();

    this.highlightSearchTerm = this.highlightSearchTerm.bind(this);
  }

  highlightSearchTerm(value) {
    const start = value.toLowerCase().indexOf(this.props.searchTerm.toLowerCase());
    if (start >= 0) {
      const matchingValue = value.substr(start, this.props.searchTerm.length);
      return (
        <span>
          <span style={{display: 'inline'}}>{String(value.substr(0, start))}</span>
          <span className={`highlight`}>
            {matchingValue}
          </span>
          <span style={{display: 'inline'}}>{value.substr(start + this.props.searchTerm.length)}</span>
        </span>
      );
    }

    return value;
  }

  render() {
    const disclosure = this.props.disclosure;
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

    const classes = classNames(
      styles.container,
      this.props.className,
      {[styles.selected]: this.props.selected}
    );

    const disclosureStatus = getAdminDisclosureStatusString(
      this.context.configState,
      disclosure.statusCd,
      this.context.configState.config.id
    );
    return (
      <Link to={`/coi/admin/detailview/${this.props.disclosure.id}/${disclosure.statusCd}`}>
        <li className={classes}>
          {/*<div className={styles.disclosureType}>
            {this.highlightSearchTerm(disclosure.type)}
          </div>*/}
          <div className={styles.submittedBy}>{this.highlightSearchTerm(disclosure.submitted_by)}</div>
          {dateToShow}
          <div>{disclosureStatus}</div>
        </li>
      </Link>
    );
  }
}

DisclosureListItem.contextTypes = {
  configState: React.PropTypes.object
};
