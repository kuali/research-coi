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
import React from 'react'; // eslint-disable-line no-unused-vars
import {Router, Route} from 'react-router';
import {Dashboard} from './dashboard/dashboard';
import {Disclosure} from './disclosure';
import TravelLog from './travel-log/travel-log';
import {Archive} from './archive/archive';
import {Revise} from './revise/revise';
import {SizeAwareComponent} from '../size-aware-component';
import {processResponse, createRequest} from '../../http-utils';
import ColorStore from '../../stores/color-store';
import history from '../../history';

class App extends SizeAwareComponent {
  constructor() {
    super();

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
      <Router history={history}>
        <Route path="/coi/archiveview" component={Archive} />
        <Route path="/coi/dashboard" component={Dashboard} />
        <Route path="/coi/disclosure" component={Disclosure} />
        <Route path="/coi/travelLog" component={TravelLog} />
        <Route path="/coi/revise/:id" component={Revise} />
        <Route path="/coi/*" component={Dashboard} />
      </Router>
    );
  }
}

window.colorBlindModeOn = false;
if (window.localStorage.getItem('colorBlindModeOn') === 'true') {
  document.body.classList.add('color-blind');
  window.colorBlindModeOn = true;
}

// Then load config and re-render
createRequest()
  .get('/api/coi/config')
  .end(processResponse((err, config) => {
    if (!err) {
      window.config = config.body;
      ReactDOM.render(<App />, document.querySelector('#theApp'));
    }
  }));

