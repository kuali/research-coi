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

import React from 'react';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import ConfigStore from '../../../stores/ConfigStore';

export default class RevisionHeader extends React.Component {
  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        borderBottom: '1px solid #DDD'
      },
      disclosureType: {
        display: 'inline-block',
        borderRight: '2px solid #ABABAB',
        fontSize: 30,
        fontWeight: 300,
        paddingRight: 22,
        margin: '10px 22px 10px 48px',
        verticalAlign: 'middle'
      },
      dates: {
        display: 'inline-block',
        verticalAlign: 'middle',
        fontWeight: 'bold',
        fontSize: 15
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.disclosureType}>
          {ConfigStore.getDisclosureTypeString(this.props.disclosureType).toUpperCase()}
        </span>
        <span style={styles.dates}>
          <div>Submitted on {formatDate(this.props.submittedDate)}</div>
          <div>Returned for Revisions on {formatDate(this.props.returnedDate)}</div>
        </span>
      </div>
    );
  }
}
