import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';
import {SortArrow} from './SortArrow';
import {TableHeading} from './TableHeading';
import {AdminActions} from '../../../actions/AdminActions';

export class DisclosureTable extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.sortByTitle = this.sortByTitle.bind(this);
    this.sortByPI = this.sortByPI.bind(this);
    this.sortBySubmittedDate = this.sortBySubmittedDate.bind(this);
    this.sortByStatus = this.sortByStatus.bind(this);
    this.sortByDisposition = this.sortByDisposition.bind(this);
    this.sortByStartDate = this.sortByStartDate.bind(this);
  }

  changeSort(field) {
    if (this.props.sort === field) {
      AdminActions.flipSortDirection();
    }
    else {
      AdminActions.changeSort(field);
    }
  }

  sortByTitle() {
    this.changeSort('PROJECT_TITLE');
  }

  sortByPI() {
    this.changeSort('PI');
  }

  sortBySubmittedDate() {
    this.changeSort('DATE_SUBMITTED');
  }

  sortByStatus() {
    this.changeSort('STATUS');
  }

  sortByDisposition() {
    this.changeSort('DISPOSITION');
  }

  sortByStartDate() {
    this.changeSort('PROJECT_START_DATE');
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        backgroundColor: '#D8D9D6'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let disclosures = this.props.disclosures.map((disclosure) => {
      return (
        <DisclosureTableRow
          key={disclosure.id}
          id={disclosure.id}
          name={disclosure.projects[0].name}
          submittedBy={disclosure.submittedBy}
          status={disclosure.status}
          disposition={disclosure.disposition}
          submittedOn={disclosure.submittedOn}
        />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        {disclosures}
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
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
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosures = this.props.disclosures.map((disclosure) => {
      return (
        <DisclosureTableRow
          key={disclosure.id}
          id={disclosure.id}
          name={disclosure.projects[0].name}
          submittedBy={disclosure.submittedBy}
          submittedOn={disclosure.submittedOn}
          status={disclosure.status}
          disposition={disclosure.disposition}
          startDate={disclosure.startDate}
        />
      );
    });

    let sortArrow = <SortArrow direction={this.props.sortDirection} />;

    return (
      <div role="grid" style={merge(styles.container, this.props.style)}>
        <div role="row" style={styles.headings}>
          <TableHeading sort={this.sortByTitle} active={this.props.sort === 'PROJECT_TITLE'}>PROJECT TITLE</TableHeading>
          <TableHeading sort={this.sortByPI} active={this.props.sort === 'PI'}>PI</TableHeading>
          <TableHeading sort={this.sortBySubmittedDate} active={this.props.sort === 'DATE_SUBMITTED'}>DATE SUBMITTED</TableHeading>
          <TableHeading sort={this.sortByStatus} active={this.props.sort === 'STATUS'}>STATUS</TableHeading>
          <TableHeading sort={this.sortByDisposition} active={this.props.sort === 'DISPOSITION'}>DISPOSITION</TableHeading>
          <TableHeading sort={this.sortByStartDate} active={this.props.sort === 'PROJECT_START_DATE'}>PROJECT START DATE</TableHeading>
        </div>
        <div style={{display: 'table-row-group'}}>
          {disclosures}
        </div>
      </div>
    );  
  }
}