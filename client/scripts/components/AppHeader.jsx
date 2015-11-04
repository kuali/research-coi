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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../merge';
import ReactRouter from 'react-router';
let Link = ReactRouter.Link;
import {KualiLogo} from './DynamicIcons/KualiLogo';
import {createRequest} from '../HttpUtils';
import ToggleSwitch from './ToggleSwitch';
import ColorActions from '../actions/ColorActions';
import cookies from 'cookies-js';

export class AppHeader extends React.Component {
  constructor() {
    super();

    this.state = {
      usersName: ''
    };

    this.onContrastChange = this.onContrastChange.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  onContrastChange(newValue) {
    ColorActions.setColorBlindMode(newValue === 'On' ? true : false);
  }

  logOut() {
    cookies.expire('authToken');
    window.location = '/coi';
  }

  componentWillMount() {
    createRequest().get('/api/coi/userinfo')
    .end((err, response) => {
      if (!err) {
        let userInfo = response.body;
        this.setState({
          usersName: `${userInfo.firstName} ${userInfo.lastName}`,
          mock: userInfo.mock
        });
      }
    });
  }

  render() {
    let styles = {
      logo: {
        width: 26,
        height: 26,
        verticalAlign: 'middle',
        color: 'black'
      },
      kuali: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginTop: '-3px'
      },
      product: {
        color: 'black',
        fontSize: 20,
        fontWeight: window.colorBlindModeOn ? 'normal' : '300',
        verticalAlign: 'middle',
        paddingLeft: 5,
        paddingRight: 18,
        borderRight: '1px solid',
        marginRight: 15
      },
      modulename: {
        color: 'black',
        fontSize: 16,
        fontWeight: window.colorBlindModeOn ? 'normal' : '300',
        paddingLeft: 5,
        paddingTop: 7
      },
      searchIcon: {
        width: '28px',
        verticalAlign: 'middle',
        padding: '0 10px',
        cursor: 'pointer'
      },
      controls: {
        'float': 'right',
        display: 'inline-block',
        padding: 10,
        fontSize: 13,
        color: window.colorBlindModeOn ? 'black' : '#808080'
      },
      icon: {
        color: '#676767',
        width: '65px',
        verticalAlign: 'middle',
        padding: '0 10px'
      },
      mobileMenu: {
        color: 'white',
        height: '100%'
      },
      container: {
        backgroundColor: 'white',
        padding: '0 10px 0 50px'
      },
      usersName: {
        textTransform: 'uppercase',
        paddingLeft: 30,
        verticalAlign: 'middle'
      },
      signOut: {
        borderRight: '1px solid #555555',
        padding: '0px 30px',
        verticalAlign: 'middle',
        cursor: 'pointer',
        color: window.colorBlindModeOn ? 'black' : '#555555'
      }
    };

    let signOut;
    if (this.state.mock === true) {
      signOut = (
        <a style={styles.signOut} href="#" onClick={this.logOut}>
          <i className="fa fa-sign-out" style={{paddingRight: 5, fontSize: 16}}></i>
          SIGN OUT
        </a>
      );
    } else {
      signOut = (
        <a style={styles.signOut} href="/auth/signout?return_to=/coi">
          <i className="fa fa-sign-out" style={{paddingRight: 5, fontSize: 16}}></i>
          SIGN OUT
        </a>
      );
    }
    return (
      <header style={merge(styles.container, this.props.style)}>
        <span style={{margin: '6px 0', display: 'inline-block'}}>
          <Link to={this.props.homelink}>
            <KualiLogo style={styles.logo} />
            <span style={styles.product}>
              Kuali
              <span style={{fontWeight: 'bold'}}>Research</span>
            </span>
          </Link>
          <span style={styles.kuali}>
            <div style={styles.modulename}>Conflict Of Interest</div>
          </span>
        </span>
        <span style={styles.controls}>
          <span style={{verticalAlign: 'middle'}}>
            <ToggleSwitch
              onChange={this.onContrastChange}
              defaultValue={window.colorBlindModeOn ? 'On' : 'Off'}
              label="CONTRAST MODE"
            />
          </span>
          {signOut}
          <span style={styles.usersName}>
            Welcome,
            <span style={{marginLeft: 3}}>
              {this.state.usersName}
            </span>
          </span>
        </span>
      </header>
    );
  }
}
