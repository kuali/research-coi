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
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';

export class KButton extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
      container: {
        backgroundColor: 'white',
        color: '#666666',
        border: '1px Solid #DEDEDE',
        borderRadius: 5,
        width: 124,
        padding: 7,
        fontSize: 13,
        outline: 0,
        cursor: 'pointer'
      }
    };
  }

  renderMobile() {
    let mobileStyles = {
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <button
        {...this.props}
        style={merge(styles.container, this.props.style)}
      >
        {this.props.children}
      </button>
    );
  }

  renderDesktop() {
    let desktopStyles = {
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <button
        {...this.props}
        style={merge(styles.container, this.props.style)}
      >
        {this.props.children}
      </button>
    );
  }
}
