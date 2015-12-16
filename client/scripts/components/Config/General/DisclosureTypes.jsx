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
import DisclosureType from './DisclosureType';

export default function DisclosureTypes(props: Object): React.Element {
  const styles = {
    container: {
      padding: '20px 23px 10px 23px',
      fontSize: 15
    },
    optionRow: {
      paddingBottom: 20
    },
    editLink: {
      marginLeft: 10
    },
    checkbox: {
      marginRight: 10
    },
    title: {
      fontSize: 12,
      marginBottom: 10
    }
  };

  let rows;
  if (props.types && props.types.length > 0) {
    rows = (
      <div>
        <div style={styles.optionRow} className="flexbox row">
          <DisclosureType type={props.types[1]} canToggle={true} />
          <DisclosureType type={props.types[3]} canToggle={true} />
        </div>
        <div style={styles.optionRow}>
        </div>
      </div>
    );
  }

  return (
    <div style={merge(styles.container, props.style)}>
      <div style={styles.title}>DISCLOSURE TITLE</div>
      {rows}
    </div>
  );
}
