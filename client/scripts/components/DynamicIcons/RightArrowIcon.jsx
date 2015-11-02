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

import React from 'react/addons';

export class RightArrowIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} enable-background="new 0 0 32 32" viewBox="0 0 32 40" y="0px" x="0px" version="1.0" role="img" aria-labelledby="title">
        <title id="title">Right Arrow Icon</title>
         <path fill={this.props.style.color} id="path4" d="M 32,16 C 32,7.165 24.836,0 16,0 7.164,0 0,7.164 0,16 0,24.836 7.164,32 16,32 24.836,32 32,24.835 32,16 Z M 10.249359,23.522036 17.575697,16.130849 10.319565,9.2190559 13.315342,6.1108676 23.335577,16.222031 13.625245,26.510375 Z" />
      </svg>
    );
  }
}

RightArrowIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
