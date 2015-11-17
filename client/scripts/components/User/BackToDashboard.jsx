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
import {merge} from '../../merge';
import {Link} from 'react-router';

export default class BackToDashboard extends React.Component {
  render() {
    let styles = {
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
      }
    };

    return (
      <Link to={"/dashboard"}>
        <div style={merge(styles.container, this.props.style)}>
          <div>
            <i className="fa fa-arrow-left"></i>
            <span style={{marginLeft: 15}}>BACK TO DASHBOARD</span>
          </div>
        </div>
      </Link>
    );
  }
}
