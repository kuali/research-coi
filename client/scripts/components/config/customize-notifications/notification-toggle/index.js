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

export default class ToggleSwitch extends React.Component {
  constructor(props) {
    super();

    this.state = {
      on: props.defaultValue
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const newValue = !this.state.on;
    this.setState({
      on: newValue
    });

    if (this.props.onChange) {
      this.props.onChange(this.props.propertyPath);
    }
  }

  render() {
    const classes = classNames(
      styles.toggle,
      {[styles.on]: this.state.on},
      this.props.className
    );

    const baseClasses = classNames(
      styles.base,
      {[styles.on]: this.state.on}
    );

    return (
      <div className={styles.container}>
        <span onClick={this.onClick} className={classes}>
          <span style={{margin: '0 20px'}}>
            <span className={baseClasses}>
              <span className={styles.label}>OFF</span>
              <span className={styles.label}>ON</span>
              <span className={styles.slider}></span>
            </span>
          </span>
        </span>
      </div>
    );
  }
}
