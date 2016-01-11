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

/* eslint-disable max-len */

import React from 'react';

export default function Gripper(props) {
  return (
    <svg className={props.className} version="1.1" data-icon="menu" data-container-transform="translate(0 4)" viewBox="0 0 32 40" x="0px" y="0px" role="img" aria-label="Gripper">
      <path fill={props.color} d="M0 0v3h32v-3h-32zm0 20v3h32v-3h-32zm0 20v3h32v-3h-32z" transform="translate(0 4)"/>
    </svg>
  );
}

Gripper.defaultProps = {
  color: 'white'
};
