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
import {merge} from '../merge';

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
    const styles = {
      container: {
        backgroundColor: 'white',
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        padding: '25px 0px',
        fontSize: 20,
        textAlign: 'center',
        cursor: 'pointer',
        zIndex: 9,
        position: 'relative',
        boxShadow: '0 0 10px #CCC'
      },
      menuItems: {
        textAlign: 'left',
        borderTop: '1px solid #CCC',
        padding: '15px 20px 0 20px',
        margin: this.state.expanded ? '10px 28px 0 28px' : '-140px 28px 0 28px',
        transition: 'margin .1s ease-in-out'
      },
      menuItem: {
        display: 'block',
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 16,
        lineHeight: '38px',
        paddingLeft: 24
      },
      arrowIcon: {
        fontSize: 15,
        marginRight: 10
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)} onClick={this.toggle}>
        <div>
          <i className="fa fa-bars"></i>
          <span style={{marginLeft: 15}}>ADMIN MENU</span>
        </div>
        <div style={{overflowY: 'hidden'}}>
          <div style={styles.menuItems}>
            <a href="/coi/admin" style={styles.menuItem}>
              <i className="fa fa-chevron-left" style={styles.arrowIcon}></i>
              Admin Dashboard
            </a>
            <a href="/coi/config" style={styles.menuItem}>
              <i className="fa fa-chevron-left" style={styles.arrowIcon}></i>
              Configuration
            </a>
            <a href="/coi/" style={styles.menuItem}>
              <i className="fa fa-chevron-left" style={styles.arrowIcon}></i>
              Researcher Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
}
