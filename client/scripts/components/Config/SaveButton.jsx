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
import {merge} from '../../merge';
import ConfigActions from '../../actions/ConfigActions';

export default function SaveButton(props: Object): React.Element {
  const styles = {
    container: {
      cursor: 'pointer'
    },
    saveIcon: {
      fontSize: 28,
      color: window.colorBlindModeOn ? 'black' : '#F57C00',
      verticalAlign: 'middle'
    },
    saveText: {
      verticalAlign: 'middle',
      paddingLeft: 10,
      fontSize: 17,
      color: '#525252',
      paddingTop: 3
    }
  };

  return (
    <div className="flexbox row" onClick={ConfigActions.saveAll} style={merge(styles.container, props.style)}>
      <span>
        <i className="fa fa-check-circle" style={styles.saveIcon}></i>
      </span>
      <span className="fill" style={styles.saveText}>SAVE CHANGES</span>
    </div>
  );
}
