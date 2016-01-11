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

export default class AdminMenu extends React.Component {
  constructor() {
    super();

    this.state = {
      expanded: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const classes = classNames(
      styles.container,
      {[styles.expanded]: this.state.expanded},
      this.props.className
    );

    return (
      <div className={classes} onClick={this.toggle}>
        <div>
          <i className={`fa fa-bars`}></i>
          <span style={{marginLeft: 15}}>ADMIN MENU</span>
        </div>
        <div style={{overflowY: 'hidden'}}>
          <div className={styles.menuItems}>
            <a href="/coi/admin" className={styles.menuItem}>
              <i className={`fa fa-chevron-left ${styles.arrowIcon}`}></i>
              Admin Dashboard
            </a>
            <a href="/coi/config" className={styles.menuItem}>
              <i className={`fa fa-chevron-left ${styles.arrowIcon}`}></i>
              Configuration
            </a>
            <a href="/coi/" className={styles.menuItem}>
              <i className={`fa fa-chevron-left ${styles.arrowIcon}`}></i>
              Researcher Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
}
