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

import ReactDOM from 'react-dom';
import React from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {Dashboard} from './dashboard/dashboard';
import {Disclosure} from './disclosure';
import TravelLog from './travel-log/travel-log';
import {Archive} from './archive/archive';
import ReadOnlyView from './read-only-view/read-only';
import {Revise} from './revise/revise';
import {SizeAwareComponent} from '../size-aware-component';
import UserInfoStore from '../../stores/user-info-store';
import ConfigStore from '../../stores/config-store';
import ColorStore from '../../stores/color-store'; // eslint-disable-line no-unused-vars

function latestState() {
  return {
    configState: ConfigStore.getState(),
    userInfoState: UserInfoStore.getState()
  };
}

const router = (
  <Router history={browserHistory}>
    <Route path="/coi/new/readonly/:id" component={ReadOnlyView} />
    <Route path="/coi/new/archiveview" component={Archive} />
    <Route path="/coi/new/dashboard" component={Dashboard} />
    <Route path="/coi/new/disclosure" component={Disclosure} />
    <Route path="/coi/new/travelLog" component={TravelLog} />
    <Route path="/coi/new/revise/:id" component={Revise} />
    <Route path="/coi/new/*" component={Dashboard} />
  </Router>
);

class App extends SizeAwareComponent {
  constructor() {
    super();

    this.state = latestState();

    this.onChange = this.onChange.bind(this);
  }

  getChildContext() {
    return {
      configState: this.state.configState,
      userInfo: this.state.userInfoState.userInfo
    };
  }
  
  componentDidMount() {
    UserInfoStore.listen(this.onChange);
    ConfigStore.listen(this.onChange);
  }

  componentWillUnmount() {
    UserInfoStore.unlisten(this.onChange);
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState(latestState());
    this.forceUpdate();
  }

  render() {
    if (this.state.userInfoState.userInfo.coiRole === undefined) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    return router;
  }
}

App.childContextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};

function renderApp() {
  ReactDOM.render(<App />, document.querySelector('#theApp'));
  ConfigStore.unlisten(renderApp);
}

ConfigStore.listen(renderApp);

window.colorBlindModeOn = false;
if (window.localStorage.getItem('colorBlindModeOn') === 'true') {
  document.body.classList.add('color-blind');
  window.colorBlindModeOn = true;
}
