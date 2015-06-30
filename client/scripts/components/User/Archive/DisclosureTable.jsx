import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';

export class DisclosureTable extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  shouldComponentUpdate() {return true;}

  renderMobile() {
    let mobileStyles = {
      container: {
        backgroundColor: '#D8D9D6'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let disclosures = this.props.disclosures.sort((a, b) => {
      if (a.submittedOn > b.submittedOn) return -1;
      else if (a.submittedOn === b.submittedOn) return 0;
      else return 1;
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
        color: 'black',
        fontSize: 14,
        backgroundColor: 'white', 
        display: 'table-row',
        cursor: 'pointer',
        padding: 10,
        fontWeight: 300
      },
      heading: {
        padding: '15px 20px', 
        display: 'table-cell',
        borderBottom: '1px solid #aaa',
        whiteSpace: 'nowrap'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosures = this.props.disclosures.sort((a, b) => {
      if (a.submittedOn > b.submittedOn) return -1;
      else if (a.submittedOn === b.submittedOn) return 0;
      else return 1;
    }).map((disclosure) => {
      return (
        <DisclosureTableRow
          key={disclosure.id}
          name={disclosure.title}
          submittedOn={disclosure.submittedOn}
          disposition={disclosure.disposition}
          startDate={disclosure.startDate}
        />
      );
    });

    return (
      <div role="grid" style={merge(styles.container, this.props.style)}>
        <div role="row" style={styles.headings}>
          <span style={styles.heading} role="columnheader">PROJECT TITLE</span>
          <span style={styles.heading} role="columnheader">DATE SUBMITTED</span>
          <span style={styles.heading} role="columnheader">DISPOSITION</span>
          <span style={styles.heading} role="columnheader">PROJECT START DATE</span>
        </div>
        <div style={{display: 'table-row-group'}}>
          {disclosures}
        </div>
      </div>
    );  
  }
}