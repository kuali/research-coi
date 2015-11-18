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

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import {processResponse, createRequest} from '../../HttpUtils';
import {DetailView} from './DetailView/DetailView';
import {ListView} from './ListView/ListView';
import {SizeAwareComponent} from '../SizeAwareComponent';
import ColorStore from '../../stores/ColorStore';
import createBrowserHistory from 'history/lib/createBrowserHistory';

class App extends SizeAwareComponent {
  constructor() {
    super();

    this.state = {
      browserHistory: createBrowserHistory()
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    ColorStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ColorStore.unlisten(this.onChange);
  }

  onChange() {
    this.forceUpdate();
  }

  render() {
    return (
      <Router history={this.state.browserHistory}>
        <Route path="/coi/admin/detailview" component={DetailView}>
          <Route path="/coi/admin/detailview/:id/:statusCd" component={DetailView}/>
        </Route>
        <Route path="/coi/admin/listview" component={ListView} />
        <Route path="/coi/admin*" component={ListView} />
      </Router>
    );
  }
}

window.colorBlindModeOn = window.localStorage.getItem('colorBlindModeOn') === 'true';

// Then load config and re-render
createRequest()
  .get('/api/coi/config')
  .end(processResponse((err, config) => {
    if (!err) {
      window.config = config.body;
      ReactDOM.render(<App />, document.querySelector('#theApp'));
    }
  }));
