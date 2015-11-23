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

export default function CheckmarkIcon(props: Object): React.Element {
  return (
    <svg {...props} style={props.style} version="1.1" data-icon="check" data-container-transform="translate(2 15)" viewBox="0 0 128 160" x="0px" y="0px">
      <title id="title">Checkmark Icon</title>
      <path fill={props.style.color} d="M112.156.188l-5.469 5.844-64.906 68.938-24.188-23.688-5.719-5.594-11.188 11.438 5.719 5.594 30 29.406 5.813 5.688 5.594-5.938 70.5-74.906 5.5-5.813-11.656-10.969z" transform="translate(2 15)"/>
    </svg>
  );
}

CheckmarkIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
