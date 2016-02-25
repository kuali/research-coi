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
import {DisclosureTableRow} from '../disclosure-table-row';
import {TableHeading} from '../table-heading';
import {AdminActions} from '../../../../actions/admin-actions';

export class DisclosureTable extends React.Component {
  constructor() {
    super();

    this.sortBySubmittedBy = this.sortBySubmittedBy.bind(this);
    this.sortByStatus = this.sortByStatus.bind(this);
    this.sortBySubmittedDate = this.sortBySubmittedDate.bind(this);
    this.sortByStatus = this.sortByStatus.bind(this);
    this.sortByType = this.sortByType.bind(this);
  }

  changeSort(field) {
    if (this.props.sort === field) {
      AdminActions.flipSortDirection();
    }
    else {
      AdminActions.changeSort(field);
    }
  }

  sortBySubmittedBy() {
    this.changeSort('SUBMITTED_BY');
  }

  sortBySubmittedDate() {
    this.changeSort('SUBMITTED_DATE');
  }

  sortByStatus() {
    this.changeSort('STATUS');
  }

  sortByType() {
    this.changeSort('TYPE');
  }

  render() {
    const disclosures = this.props.disclosures.map((disclosure) => {
      return (
        <DisclosureTableRow
          key={disclosure.id}
          id={disclosure.id}
          submittedBy={disclosure.submitted_by}
          type={disclosure.type}
          statusCd={disclosure.statusCd}
          submittedDate={disclosure.submitted_date}
          revisedDate={disclosure.revised_date}
          searchTerm={this.props.searchTerm}
        />
      );
    });

    return (
      <div role="grid" className={classNames(styles.container, this.props.className)}>
        <div role="row" className={styles.headings}>
          <TableHeading
            sort={this.sortBySubmittedBy}
            sortDirection={this.props.sortDirection}
            active={this.props.sort === 'SUBMITTED_BY'}
            className={`${styles.override} ${styles.colOneHeading}`}
          >
            SUBMITTED BY
          </TableHeading>
          {/*<TableHeading sort={this.sortByType} sortDirection={this.props.sortDirection} active={this.props.sort === 'TYPE'}>TYPE</TableHeading>*/}
          <TableHeading
            sort={this.sortByStatus}
            sortDirection={this.props.sortDirection}
            active={this.props.sort === 'STATUS'}
          >
            STATUS
          </TableHeading>
          <TableHeading
            sort={this.sortBySubmittedDate}
            sortDirection={this.props.sortDirection}
            active={this.props.sort === 'SUBMITTED_DATE'}
            className={`${styles.override} ${styles.colTwoHeading}`}
          >
            DATE SUBMITTED
          </TableHeading>
        </div>
        <div style={{display: 'table-row-group'}}>
          {disclosures}
        </div>
      </div>
    );
  }
}
