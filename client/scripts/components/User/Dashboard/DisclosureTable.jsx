import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';

export class DisclosureTable extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        boxShadow: '0 0 10px #C0C0C0',
        margin: 0
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let rows = this.props.disclosures.map((disclosure, index) => {
      return (
        <DisclosureTableRow
          type={disclosure.type}
          status={disclosure.status}
          lastreviewed={disclosure.lastReviewed}
          title={disclosure.title}
          expiresOn={disclosure.expiresOn}
          key={index}
        />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        {rows}
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        borderRadius: 5,
        boxShadow: '0 0 10px #C0C0C0',
        margin: '44px 50px'
      },
      heading: {
        fontWeight: 300,
        width: '25%',
        display: 'inline-block',
        padding: '20px 0',
        fontSize: 17
      },
      headings: {
        borderBottom: '1px solid #BBB',
        padding: '0 60px',
        backgroundColor: 'white',
        borderRadius: '5px 5px 0 0'
      },
      columnOne: {
        width: '35%'
      },
      columnTwo: {
        width: '25%'
      },
      columnThree: {
        width: '25%'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let rows = this.props.disclosures.map((disclosure, index) => {
      return (
        <DisclosureTableRow
          type={disclosure.type}
          status={disclosure.status}
          lastreviewed={disclosure.lastReviewed}
          title={disclosure.title}
          expiresOn={disclosure.expiresOn}
          key={index}
        />
      );
    });

    return (
      <div role="grid" style={merge(styles.container, this.props.style)}>
        <div role="row" style={styles.headings}>
          <span role="columnheader" style={merge(styles.heading, styles.columnOne)}>DISCLOSURE TYPE</span>
          <span role="columnheader" style={merge(styles.heading, styles.columnTwo)}>STATUS</span>
          <span role="columnheader" style={merge(styles.heading, styles.columnThree)}>LAST REVIEWED</span>
        </div>
        {rows}
      </div>
    );
  }
}