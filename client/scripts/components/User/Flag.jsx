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

import React from 'react'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';

export function Flag(props: Object): React.Element {
  let styles = {
    container: {
      padding: '8px 13px',
      fontSize: 15,
      display: 'inline-block',
      color: 'white',
      backgroundColor: 'inherit',
      fontWeight: 'transparent'
    }
  };

  let text;
  switch (props.type) {
    case 'NONE':
      text = 'NO CONFLICT';
      styles.container.backgroundColor = '#e0e0e0';
      styles.container.color = 'black';
      break;
    case 'POTENTIAL':
      text = 'POTENTIAL RELATIONSHIP';
      styles.container.backgroundColor = '#535353';
      break;
    case 'MANAGED':
      text = 'MANAGED RELATIONSHIP';
      styles.container.backgroundColor = '#434343';
      break;
    case 'ATTENTION':
      text = 'ATTENTION REQUIRED';
      styles.container.backgroundColor = 'black';
      styles.container.fontWeight = 'bold';
      break;
  }

  return (
    <span style={merge(styles.container, props.style)}>
      {text}
    </span>
  );
}
