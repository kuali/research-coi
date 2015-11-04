/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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
        margin: '44px 50px',
        overflow: 'hidden'
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
