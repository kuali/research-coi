import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';
import {SortArrow} from './SortArrow';

export class DisclosureTable extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  getStartIndex(pageSize) {
    return (this.props.page * pageSize) - pageSize;
  }

  getStopIndex(pageSize) {
    let proposedStop = this.props.page * pageSize - 1;
    if (!this.props.disclosures || this.props.disclosures.length === 0) {
      return 0;
    }
    else if (proposedStop < this.props.disclosures.length) {
      return proposedStop + 1;
    }
    else {
      return this.props.disclosures.length;
    }
  }

  changeSort(evt) {
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        backgroundColor: '#D8D9D6'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let disclosures = [];
    const PAGE_SIZE = 5;
    let start = this.getStartIndex(PAGE_SIZE);
    let stop = this.getStopIndex(PAGE_SIZE);
    for (let i = start ; i < stop; i++) {
      let disclosure = this.props.disclosures[i];

      disclosures.push(
        <DisclosureTableRow
          key={disclosure.id}
          name={disclosure.projects[0].name}
          submittedBy={disclosure.submittedBy}
          status={disclosure.status}
          disposition={disclosure.disposition}
          submittedOn={disclosure.submittedOn}
        />
      );
    }

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
      },
      heading: {
        padding: '15px 20px', 
        display: 'table-cell',
        borderBottom: '1px solid #aaa',
        whiteSpace: 'nowrap'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosures = [];
    const PAGE_SIZE = 10;
    let startIndex = this.getStartIndex(PAGE_SIZE);
    let stopIndex = this.getStopIndex(PAGE_SIZE);
    for (let i = startIndex ; i < stopIndex; i++) {
      let disclosure = this.props.disclosures[i];
      disclosures.push(
        <DisclosureTableRow
          key={disclosure.id}
          name={disclosure.projects[0].name}
          submittedBy={disclosure.submittedBy}
          submittedOn={disclosure.submittedOn}
          status={disclosure.status}
          disposition={disclosure.disposition}
        />
      );
    }

    let sortArrow = <SortArrow direction={this.props.sortDirection} />;

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.headings}>
          <span style={styles.heading} onClick={this.changeSort} value="PROJECT_TITLE">
            PROJECT TITLE 
            {this.props.sort === 'PROJECT_TITLE' ? sortArrow : <span></span>}
          </span>
          <span style={styles.heading} onClick={this.changeSort} value="PI">
            PI
            {this.props.sort === 'PI' ? sortArrow : <span></span>}
          </span>
          <span style={styles.heading} onClick={this.changeSort} value="SUBMITTED_DATE">
            DATE SUBMITTED
            {this.props.sort === 'DATE_SUBMITTED' ? sortArrow : <span></span>}
          </span>
          <span style={styles.heading} onClick={this.changeSort} value="STATUS">
            STATUS
            {this.props.sort === 'STATUS' ? sortArrow : <span></span>}
          </span>
          <span style={styles.heading} onClick={this.changeSort} value="DISPOSITION">
            DISPOSITION
            {this.props.sort === 'DISPOSITION' ? sortArrow : <span></span>}
          </span>
          <span style={styles.heading} onClick={this.changeSort} value="PROJECT_START_DATE">
            PROJECT START DATE
            {this.props.sort === 'PROJECT_START_DATE' ? sortArrow : <span></span>}
          </span>
        </div>
        <div style={{display: 'table-row-group'}}>
          {disclosures}
        </div>
      </div>
    );  
  }
}

DisclosureTable.defaultProps = {
  page: 1
};