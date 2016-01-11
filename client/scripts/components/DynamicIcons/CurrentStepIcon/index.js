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

/* eslint-disable */

import React from 'react';

export function CurrentStepIcon(props: Object): React.Element {
  return (
    <svg style={props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 42 42" enable-background="new 0 0 42 42" role="img" aria-labelledby="title">
      <title id="title">Current Step Icon</title>
      <g>
        <circle fill={props.style.color} cx="21" cy="20.9" r="6.1"/>
        <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="-2103.2007" y1="-11432.2627" x2="-2096.5986" y2="-11439.167" gradientTransform="matrix(2.9636 0 0 -2.9636 6240.5415 -33873.1328)">
          <stop offset="0" style={{stopColor: '#C2C2C2'}} />
          <stop offset="1" style={{stopColor: '#4D4D4D'}} />
        </linearGradient>
        <path fill={props.style.color} d="M21,6.8C13.2,6.8,6.8,13.2,6.8,21S13.2,35.2,21,35.2c2.2,0,4.4-0.5,6.3-1.5c2.7-1.3,4.9-3.5,6.3-6.1
          c1-2,1.6-4.2,1.6-6.6C35.2,13.2,28.8,6.8,21,6.8z M32.5,26.4c-1.3,2.7-3.5,4.9-6.3,6.1c-1.6,0.7-3.3,1.1-5.2,1.1
          C14,33.7,8.3,28,8.3,21S14,8.3,21,8.3S33.7,14,33.7,21C33.7,23,33.3,24.8,32.5,26.4z"/>
      </g>
    </svg>
  );
}

CurrentStepIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
