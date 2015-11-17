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

export class CloseIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} viewBox="0 0 90 113.75" role="img" aria-labelledby="title">
        <title id="title">Close Icon</title>
        <path fill={this.props.style.color} fill-rule="evenodd" d="M47.247 44.918l14.495 14.496c.78.78.78 2.047 0 2.828-.78.78-2.047.78-2.828 0L44.418 47.747 29.94 62.224c-.78.78-2.046.78-2.827 0-.78-.78-.78-2.048 0-2.83L41.59 44.92 27.694 31.023c-.78-.78-.78-2.048 0-2.83.78-.78 2.048-.78 2.83 0L44.417 42.09l14.477-14.477c.78-.78 2.048-.78 2.83 0 .78.78.78 2.047 0 2.828L47.246 44.92zM76.82 77.32c17.573-17.574 17.573-46.066 0-63.64-17.574-17.573-46.066-17.573-63.64 0-17.573 17.574-17.573 46.066 0 63.64 17.574 17.573 46.066 17.573 63.64 0z"/>
      </svg>
    );
  }
}

CloseIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
