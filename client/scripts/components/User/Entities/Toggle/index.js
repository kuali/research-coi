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
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class Toggle extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.props.onClick) {
      this.props.onClick(this.props.typeCd);
    }
  }

  renderMobile() {}

  renderDesktop() {
    const desktopStyles = {
      container: {
        whiteSpace: 'nowrap',
        padding: '5px 2px',
        fontSize: 12,
        width: 135,
        color: '#666',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0 0 15px #eee'
      },
      selected: {
        whiteSpace: 'nowrap',
        padding: '6px 3px',
        fontSize: 12,
        width: 135,
        color: 'white',
        border: 0,
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        borderRadius: 5
      }
    };
    const styles = merge(this.commonStyles, desktopStyles);

    return (
      <button
        onClick={this.toggle}
        style={merge(this.props.selected ? styles.selected : styles.container, this.props.style)}
      >
        {this.props.text}
      </button>
    );
  }
}
