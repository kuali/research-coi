import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
const PAGE_SIZE = 10;

export class DisclosureTable extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  renderMobile() {
    let mobileStyles = {
      container: {
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
      </span>
    );
  }

  getStartIndex() {
    return (this.props.page * PAGE_SIZE) - PAGE_SIZE;
  }

  getStopIndex() {
    let proposedStop = this.props.page * PAGE_SIZE - 1;
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
      },
      value: {
        padding: '11px 20px',
        display: 'table-cell',
        borderBottom: '1px solid #AAA',
        fontSize: 15,
        textOverflow: 'ellipsis'
      },
      startDate: {
        width: '10%'
      },
      arrow: {
        fontSize: 9,
        marginLeft: 5,
        verticalAlign: 'top'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosures = [];
    let start = this.getStartIndex();
    let stop = this.getStopIndex();
    for (let i = start ; i < stop; i++) {
      let disclosure = this.props.disclosures[i];

      disclosures.push(
        <div 
          style={{display: 'table-row', height: 50}}
          key={disclosure.id}
        >
          <span style={styles.value}>
            {disclosure.projects[0].name}
          </span>
          <span style={styles.value}>
            {disclosure.submittedBy}
          </span>
          <span style={styles.value}>
            {new Date(disclosure.submittedOn).toLocaleDateString()}
          </span>
          <span style={styles.value}>
            {disclosure.status}
          </span>
          <span style={styles.value}>
            {disclosure.disposition}
          </span>
          <span style={merge(styles.startDate, styles.value)}>
            {new Date(disclosure.submittedOn).toLocaleDateString()}
          </span>
        </div>
      );
    }

    let sortArrow;
    if (this.props.sortDirection === 'DESCENDING') {
      sortArrow = (
        <span style={styles.arrow}>&#9660;</span>
      );
    } 
    else {
      sortArrow = (
        <span style={styles.arrow}>&#9650;</span>
      );
    }

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
            {this.props.sort === 'SUBMITTED_DATE' ? sortArrow : <span></span>}
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