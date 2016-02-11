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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import ToggleButton from '../toggle-button';

export class Toggle extends React.Component {
  constructor() {
    super();

    this.clicked = this.clicked.bind(this);
  }

  clicked(value) {
    this.props.onChange(value.code);
  }

  render() {
    const buttons = this.props.values.map((value, index, array) => {
      const classes = classNames(
        styles.override,
        {[styles.first]: index === 0},
        {[styles.last]: index === array.length - 1}
      );

      return (
        <ToggleButton
          className={classes}
          onClick={this.clicked}
          value={value}
          key={value.code}
          isSelected={this.props.selected === value.code}
        />
      );
    });

    return (
      <span className={`${styles.container} ${this.props.className}`}>
        {buttons}
      </span>
    );
  }
}
