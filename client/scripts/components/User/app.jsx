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

import ReactDOM from 'react-dom';
import React from 'react'; // eslint-disable-line no-unused-vars
import {Router, Route} from 'react-router';
import {Dashboard} from './Dashboard/Dashboard';
import {Disclosure} from './Disclosure';
import {TravelLog} from './TravelLog/TravelLog';
import {Archive} from './Archive/Archive';
import {Revise} from './Revise/Revise';
import {SizeAwareComponent} from '../SizeAwareComponent';
import {processResponse, createRequest} from '../../HttpUtils';
import ColorStore from '../../stores/ColorStore';

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
      <Router>
        <Route path="/archiveview" component={Archive} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/disclosure" component={Disclosure} />
        <Route path="/travelLog" component={TravelLog} />
        <Route path="/revise/:id" component={Revise} />
        <Route path="*" component={Dashboard} />
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

