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

import React from 'react'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import ConfigStore from '../../../stores/ConfigStore';
import {formatDate} from '../../../formatDate';

export class DisclosureDetailHeading extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        padding: '13px 8px 13px 25px',
        lineHeight: '20px',
        minHeight: 89,
        boxShadow: '0 2px 9px #CCC',
        zIndex: 1,
        position: 'relative'
      },
      type: {
        fontWeight: 'bold'
      },
      heading: {
        fontSize: 19,
        marginBottom: 3
      },
      disclosure: {
        fontWeight: 'bold',
        marginRight: 5
      },
      id: {
        fontWeight: 'bold',
        marginLeft: 5
      },
      label: {
        marginRight: 5
      },
      value: {
        fontWeight: 'bold'
      },
      details: {
        fontSize: 15
      }
    };

    let disclosure = this.props.disclosure;

    let dateSection;
    if (disclosure.revisedDate) {
      dateSection = (
        <div style={merge(styles.details)}>
          <span style={styles.label}>Revised On:</span>
          <span style={styles.value}>
            <span style={{marginRight: 3}}>{formatDate(disclosure.revisedDate)}</span>
            <span style={{marginRight: 3}}>•</span>
            {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}
          </span>
        </div>
      );
    }
    else {
      dateSection = (
        <div style={merge(styles.details)}>
          <span style={styles.label}>Submitted On:</span>
          <span style={styles.value}>
            <span style={{marginRight: 3}}>{formatDate(disclosure.submittedDate)}</span>
            <span style={{marginRight: 3}}>•</span>
            {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}
          </span>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <span>
          <div style={styles.heading}>
            <span style={styles.disclosure}>
              <span style={{marginRight: 3}}>
                {ConfigStore.getDisclosureTypeString(disclosure.typeCd)}
              </span>
              •
            </span>
            <span>ID</span>
            <span style={styles.id}>#{disclosure.id}</span>
          </div>
          <div style={styles.details}>
            <span style={styles.label}>Submitted By:</span>
            <span style={styles.value}>{disclosure.submittedBy}</span>
          </div>
          {dateSection}
        </span>
      </div>
    );
  }
}
