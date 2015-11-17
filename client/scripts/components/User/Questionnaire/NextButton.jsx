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
import {merge} from '../../../merge';

export class NextButton extends React.Component {
  constructor() {
    super();

    this.submit = this.submit.bind(this);
  }

  submit() {
    if (this.props.isValid) {
      this.props.onClick();
    }
  }

  render() {
    let iconColor = '#F57C00';
    if (!this.props.isValid) {
      iconColor = '#AAA';
    }
    else if (window.colorBlindModeOn) {
      iconColor = 'black';
    }

    let styles = {
      icon: {
        color: iconColor,
        marginRight: 3,
        width: 33,
        fontSize: 26,
        verticalAlign: 'middle'
      },
      next: {
        display: 'inline-block',
        cursor: 'pointer'
      },
      disabled: {
        color: '#AAA',
        cursor: 'default'
      },
      text: {
        verticalAlign: 'middle'
      }
    };

    let nextStyle = {};
    if (this.props.isValid) {
      nextStyle = styles.next;
    } else {
      nextStyle = merge(styles.next, styles.disabled);
    }

    return (
      <div style={nextStyle} onClick={this.submit}>
        <span style={styles.text}>NEXT</span>
        <i className="fa fa-arrow-right" style={styles.icon}></i>
      </div>
    );
  }
}
