import React from 'react/addons';
import {merge} from '../../../merge';
import {DisclosureTableRow} from './DisclosureTableRow';
import {COIConstants} from '../../../../../COIConstants';

export class DisclosureTable extends React.Component {
  atLeastOneRowHasButton(disclosures) {
    if (!disclosures || !Array.isArray(disclosures)) {
      return false;
    }

    return disclosures.some(disclosure => {
      return (disclosure.status === COIConstants.DISCLOSURE_STATUS.IN_PROGRESS ||
              disclosure.status === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE ||
              disclosure.status === COIConstants.DISCLOSURE_STATUS.EXPIRED ||
              disclosure.status === COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED);
    });
  }

  render() {
    let showButtonColumn = this.atLeastOneRowHasButton(this.props.disclosures);

    let styles = {
      container: {
        borderRadius: 5,
        boxShadow: '0 0 10px #C0C0C0',
        margin: '44px 50px'
      },
      heading: {
        fontWeight: window.colorBlindModeOn ? 'normal' : 300,
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
        width: showButtonColumn ? '35%' : '33%'
      },
      columnTwo: {
        width: showButtonColumn ? '25%' : '33%'
      },
      columnThree: {
        width: showButtonColumn ? '25%' : '33%'
      }
    };

    let rows = this.props.disclosures ? this.props.disclosures.map((disclosure, index) => {
      return (
        <DisclosureTableRow
          type={disclosure.type}
          status={disclosure.status}
          lastreviewed={disclosure.last_review_date}
          title={disclosure.title}
          expiresOn={disclosure.expired_date}
          key={index}
          disclosureId={disclosure.id}
          showButtonColumn={showButtonColumn}
        />
      );
    }) : null;

    return (
      <div role="grid" style={merge(styles.container, this.props.style)}>
        <div role="row" style={styles.headings}>
          <span role="columnheader" style={merge(styles.heading, styles.columnOne)}>DISCLOSURE TYPE</span>
          <span role="columnheader" style={merge(styles.heading, styles.columnTwo)}>STATUS</span>
          <span role="columnheader" style={merge(styles.heading, styles.columnThree)}>LAST REVIEW</span>
        </div>
        {rows}
      </div>
    );
  }
}
