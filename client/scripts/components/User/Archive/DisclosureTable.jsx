import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';
import {COIConstants} from '../../../../../COIConstants';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class DisclosureTable extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.sortByTitle = this.sortByTitle.bind(this);
    this.sortBySubmitted = this.sortBySubmitted.bind(this);
    this.sortByApproved = this.sortByApproved.bind(this);
    this.sortByStart = this.sortByStart.bind(this);
    this.sortByType = this.sortByType.bind(this);
    this.changeSort = this.changeSort.bind(this);
  }

  shouldComponentUpdate() { return true; }

  changeSort(forField) {
    let direction = this.props.sortDirection;
    if (this.props.sortField === forField) {
      if (this.props.sortDirection === COIConstants.SORT_DIRECTION.DESCENDING) {
        direction = COIConstants.SORT_DIRECTION.ASCENDING;
      }
      else {
        direction = COIConstants.SORT_DIRECTION.DESCENDING;
      }
    }
    DisclosureActions.setArchiveSort(forField, direction);
  }

  sortByTitle() {
    this.changeSort(COIConstants.ARCHIVE_SORT_FIELD.TITLE);
  }

  sortBySubmitted() {
    this.changeSort(COIConstants.ARCHIVE_SORT_FIELD.SUBMITTED);
  }

  sortByApproved() {
    this.changeSort(COIConstants.ARCHIVE_SORT_FIELD.APPROVED);
  }

  sortByStart() {
    this.changeSort(COIConstants.ARCHIVE_SORT_FIELD.START);
  }

  sortByType() {
    this.changeSort(COIConstants.ARCHIVE_SORT_FIELD.TYPE);
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        backgroundColor: '#D8D9D6'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let disclosures = this.props.disclosures.sort((a, b) => {
      if (a.submittedOn > b.submittedOn) { return -1; }
      else if (a.submittedOn === b.submittedOn) { return 0; }
      else { return 1; }
    }).map((disclosure) => {
      return (
        <DisclosureTableRow
          key={disclosure.id}
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
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 15,
        boxShadow: '0 0 9px #bbb',
        overflow: 'hidden'
      },
      headings: {
        padding: 10,
        color: window.config.colors.three,
        fontSize: 14,
        backgroundColor: 'white',
        display: 'table-row',
        cursor: 'pointer'
      },
      heading: {
        padding: '15px 20px',
        display: 'table-cell',
        borderBottom: '1px solid #aaa',
        whiteSpace: 'nowrap'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let negator = this.props.sortDirection === COIConstants.SORT_DIRECTION.DESCENDING ? -1 : 1;
    let disclosures = this.props.disclosures.sort((a, b) => {
      switch(this.props.sortField) {
        case COIConstants.ARCHIVE_SORT_FIELD.TITLE:
          return a.title.localeCompare(b.title) * negator;
        case COIConstants.ARCHIVE_SORT_FIELD.SUBMITTED:
          if (a.submittedOn > b.submittedOn) { return -1 * negator; }
          else if (a.submittedOn === b.submittedOn) { return 0 * negator; }
          else { return 1 * negator; }
          break;
        case COIConstants.ARCHIVE_SORT_FIELD.APPROVED:
          if (a.approvedDate > b.approvedDate) { return -1 * negator; }
          else if (a.approvedDate === b.approvedDate) { return 0 * negator; }
          else { return 1 * negator; }
          break;
        case COIConstants.ARCHIVE_SORT_FIELD.START:
          if (a.startDate > b.startDate) { return -1 * negator; }
          else if (a.startDate === b.startDate) { return 0 * negator; }
          else { return 1 * negator; }
          break;
        default:
          if (a.type > b.type) { return -1 * negator; }
          else if (a.type === b.type) { return 0 * negator; }
          else { return 1 * negator; }
          break;
      }
    });
    let rows = disclosures.map((disclosure) => {
      return (
        <DisclosureTableRow
          key={disclosure.id}
          name={disclosure.title}
          submittedOn={disclosure.submittedOn}
          startDate={disclosure.startDate}
          approvedDate={disclosure.approvedDate}
          type="STILL NEED THIS"
        />
      );
    });

    return (
      <div role="grid" style={merge(styles.container, this.props.style)}>
        <div role="row" style={styles.headings}>
          <span style={styles.heading} onClick={this.sortByTitle} role="columnheader">PROJECT TITLE</span>
          <span style={styles.heading} onClick={this.sortBySubmitted} role="columnheader">DATE SUBMITTED</span>
          <span style={styles.heading} onClick={this.sortByApproved} role="columnheader">DATE APPROVED</span>
          <span style={styles.heading} onClick={this.sortByStart} role="columnheader">PROJECT START DATE</span>
          <span style={styles.heading} onClick={this.sortByType} role="columnheader">PROJECT TYPE</span>
        </div>
        <div style={{display: 'table-row-group'}}>
          {rows}
        </div>
      </div>
    );
  }
}
