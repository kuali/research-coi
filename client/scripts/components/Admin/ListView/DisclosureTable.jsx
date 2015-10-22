import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';
import {TableHeading} from './TableHeading';
import {AdminActions} from '../../../actions/AdminActions';
import ConfigStore from '../../../stores/ConfigStore';

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
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
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
          status={ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}
          submittedDate={disclosure.submitted_date}
          searchTerm={this.props.searchTerm}
        />
      );
    });

    return (
      <div role="grid" style={merge(styles.container, this.props.style)}>
        <div role="row" style={styles.headings}>
          <TableHeading sort={this.sortBySubmittedBy} sortDirection={this.props.sortDirection} active={this.props.sort === 'SUBMITTED_BY'}>SUBMITTED BY</TableHeading>
          {/*<TableHeading sort={this.sortByType} sortDirection={this.props.sortDirection} active={this.props.sort === 'TYPE'}>TYPE</TableHeading>*/}
          <TableHeading sort={this.sortByStatus} sortDirection={this.props.sortDirection} active={this.props.sort === 'STATUS'}>STATUS</TableHeading>
          <TableHeading sort={this.sortBySubmittedDate} sortDirection={this.props.sortDirection} active={this.props.sort === 'SUBMITTED_DATE'}>DATE SUBMITTED</TableHeading>
        </div>
        <div style={{display: 'table-row-group'}}>
          {disclosures}
        </div>
      </div>
    );
  }
}
