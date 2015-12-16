/* @flow */
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
import ConfigStore from '../../../stores/ConfigStore';
import {COIConstants} from '../../../../../COIConstants';
import {Link} from 'react-router';

export function TravelLogButton(props: Object): React.Element {
  const styles = {
    container: {
      display: 'block',
      backgroundColor: '#eeeeee',
      verticalAlign: 'top',
      padding: '20px 30px 20px 30px',
      cursor: 'pointer',
      color: '#444',
      fontWeight: '300',
      borderTop: '1px solid #c0c0c0'
    },
    primary: {
      fontSize: 28,
      fontWeight: 300
    },
    secondary: {
      fontSize: 22,
      fontWeight: 'bold'
    }
  };

  return (
    <Link to={`/coi/travelLog`} style={merge(styles.container, props.style)}>
      <div>
        <span>
          <div style={styles.primary}>Update</div>
          <div style={styles.secondary}>{ConfigStore.getDisclosureTypeString(COIConstants.DISCLOSURE_TYPE.TRAVEL)}</div>
        </span>
      </div>
    </Link>
  );
}
