/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import styles from './style';
import classNames from 'classnames';
import React from 'react';

export class Toggle extends React.Component {
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.props.onClick) {
      this.props.onClick(this.props.typeCd);
    }
  }

  render() {
    const classes = classNames(
      {[styles.selected]: this.props.selected},
      {[styles.container]: !this.props.selected},
      this.props.className
    );

    return (
      <button name={this.props.text} onClick={this.toggle} className={classes}>
        {this.props.text}
      </button>
    );
  }
}
