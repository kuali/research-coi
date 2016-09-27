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

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {DetailView} from './detail-view/detail-view';
import {ListView} from './list-view/list-view';
import {SizeAwareComponent} from '../size-aware-component';
import UserInfoStore from '../../stores/user-info-store';
import ConfigStore from '../../stores/config-store';
import ColorStore from '../../stores/color-store'; // eslint-disable-line no-unused-vars

const router = (
  <Router history={browserHistory}>
    <Route path="/coi/admin/detailview" component={DetailView}>
      <Route
        path="/coi/admin/detailview/:id/:statusCd"
        component={DetailView}
      />
    </Route>
    <Route path="/coi/admin/listview" component={ListView} />
    <Route path="/coi/admin*" component={ListView} />
  </Router>
);

function latestState() {
  return {
    configState: ConfigStore.getState(),
    userInfoState: UserInfoStore.getState()
  };
}

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
