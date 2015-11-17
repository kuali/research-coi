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

export class CompletedStepIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" role="img" aria-labelledby="title">
        <title id="title">Completed Step Icon</title>
        <g>
          <path fill={this.props.style.color} d="M153.3,102.4c0,1.9,0,3.8-0.5,5.2c-2.4,23.3-20.5,41.9-43.3,45.7c-2.4,0.5-5.2,0.5-8.1,0.5
            c-28.6,0-51.4-23.3-51.4-51.4S73.3,51,101.4,51S153.3,73.8,153.3,102.4z"/>
          <path opacity="0.2" enable-background="new    " d="M152.9,107.6c-2.4,23.3-20.5,41.9-43.3,45.7c-0.5-0.5-1.4-1.4-1.9-1.9
            c-3.8-3.8-7.1-7.1-11-11c-1.9-1.9-3.3-3.3-5.2-5.2c-3.8-3.8-21.9-25.2-25.7-29.5c-0.5-0.5-0.5-1,0-1.4l6.7-5.7c0.5-0.5,1-0.5,1,0
            l0,0l0,0l0,0c1.4,1.4,2.4,2.4,3.8,3.8c4.3,4.3,8.6,8.6,12.9,12.9l0,0l22.9-40.5c0.5-0.5,1-0.5,1.4-0.5c1.9,1,7.6,4.3,8.1,4.8
            c0,0,0.5,0,0.5,0.5C126.2,82.4,150,104.8,152.9,107.6z"/>
          <path fill="#FFFFFF" d="M90.3,134.5l-25.7-29.5c-0.5-0.5-0.5-1.4,0-1.4l6.7-5.7c0.5-0.5,1.4-0.5,1.4,0l14.8,17.6
            c0.5,0.5,1.4,0.5,1.9,0l23.3-41c0.5-0.5,1-1,1.4-0.5l8.1,4.3c0.5,0.5,1,1,0.5,1.4l-31,55.2C91.8,134.9,90.8,135.4,90.3,134.5z"/>
        </g>
      </svg>
    );
  }
}

CompletedStepIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
