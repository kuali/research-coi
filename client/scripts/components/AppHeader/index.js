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
import React from 'react';
import {KualiLogo} from '../DynamicIcons/KualiLogo';
import ToggleSwitch from '../ToggleSwitch';
import ColorActions from '../../actions/ColorActions';
import cookies from 'cookies-js';
import UserInfoStore from '../../stores/UserInfoStore';

export class AppHeader extends React.Component {
  constructor() {
    super();

    this.state = {
      userInfo: UserInfoStore.getState().userInfo
    };

    this.onContrastChange = this.onContrastChange.bind(this);
    this.logOut = this.logOut.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserInfoStore.listen(this.onChange);
  }

  componentWillUnmount() {
    UserInfoStore.unlisten(this.onChange);
  }

  onChange() {
    const userInfoState = UserInfoStore.getState();
    this.setState({
      userInfo: userInfoState.userInfo
    });
  }

  onContrastChange(newValue) {
    ColorActions.setColorBlindMode(newValue === 'On' ? true : false);
  }

  logOut() {
    cookies.expire('authToken');
    window.location = '/coi';
  }

  render() {
    let signOut;
    if (this.state.userInfo && this.state.userInfo.mock === true) {
      signOut = (
        <a className={styles.signOut} href="#" onClick={this.logOut}>
          <i className={`fa fa-sign-out`} style={{paddingRight: 5, fontSize: 16}}></i>
          SIGN OUT
        </a>
      );
    } else {
      signOut = (
        <a className={styles.signOut} href="/auth/signout?return_to=/coi">
          <i className={`fa fa-sign-out`} style={{paddingRight: 5, fontSize: 16}}></i>
          SIGN OUT
        </a>
      );
    }

    let usersName;
    if (this.state.userInfo && this.state.userInfo.firstName !== undefined && this.state.userInfo.lastName !== undefined) {
      usersName = `${this.state.userInfo.firstName} ${this.state.userInfo.lastName}`;
    }

    return (
      <header className={`${styles.container} ${this.props.className}`}>
        <span style={{margin: '6px 0', display: 'inline-block'}}>
          <a href="/kc-dev">
            <KualiLogo className={`${styles.override} ${styles.logo}`} />
            <span className={styles.product}>
              Kuali
              <span style={{fontWeight: 'bold'}}>Research</span>
            </span>
          </a>
          <span className={styles.kuali}>
            <div className={styles.modulename}>Conflict Of Interest</div>
          </span>
        </span>
        <span className={styles.controls}>
          <span style={{verticalAlign: 'middle'}}>
            <ToggleSwitch
              onChange={this.onContrastChange}
              defaultValue={window.colorBlindModeOn ? 'On' : 'Off'}
              label="CONTRAST MODE"
            />
          </span>
          {signOut}
          <span className={styles.usersName}>
            Welcome,
            <span style={{marginLeft: 3}}>
              {usersName}
            </span>
          </span>
        </span>
      </header>
    );
  }
}