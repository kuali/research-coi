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

export function ProgressBar(props: Object): React.Element {
  let styles = {
    container: {
      width: '100%',
      height: 15
    },
    bar: {
      width: props.percentage + '%',
      backgroundColor: window.config.colors.two,
      height: '100%',
      transition: 'width .2s ease-in-out'
    }
  };
  return (
    <div style={merge(styles.container, props.style)} onClick={props.onClick}>
      <div style={styles.bar}></div>
    </div>
  );
}
