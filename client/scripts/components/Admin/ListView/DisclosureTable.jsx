import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';
import {TableHeading} from './TableHeading';
import {AdminActions} from '../../../actions/AdminActions';

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
    let styles = {
      container: {
        display: 'table',
        width: '100%'
      },
      headings: {
        color: window.config.colors.three,
        fontSize: 14,
        backgroundColor: 'white',
        display: 'table-row',
        cursor: 'pointer',
        padding: 10
      }
    };

    let disclosures = this.props.disclosures.map((disclosure) => {
      return (
        <DisclosureTableRow
          key={disclosure.id}
          id={disclosure.id}
          submittedBy={disclosure.submitted_by}
          type={disclosure.type}
          status={disclosure.status}
          submittedDate={disclosure.submitted_date}
          searchTerm={this.props.searchTerm}
        />
      );
    });

    return (
      <div role="grid" style={merge(styles.container, this.props.style)}>
        <div role="row" style={styles.headings}>
          <TableHeading sort={this.sortBySubmittedBy} active={this.props.sort === ''}>SUBMITTED BY</TableHeading>
          <TableHeading sort={this.sortByType} active={this.props.sort === ''}>TYPE</TableHeading>
          <TableHeading sort={this.sortByStatus} active={this.props.sort === ''}>STATUS</TableHeading>
          <TableHeading sort={this.sortBySubmittedDate} active={this.props.sort === ''}>DATE SUBMITTED</TableHeading>
        </div>
        <div style={{display: 'table-row-group'}}>
          {disclosures}
        </div>
      </div>
    );
  }
}
