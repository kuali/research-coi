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

    const classes = classNames(
      styles.next,
      {[styles.disabled]: !this.props.isValid}
    );

    return (
      <div className={classes} onClick={this.submit}>
        <span className={styles.text}>NEXT</span>
        <i className={`fa fa-arrow-right ${styles.icon}`} style={{color: iconColor}} />
      </div>
    );
  }
}
