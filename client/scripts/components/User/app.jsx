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

import React from 'react/addons';
import Router from 'react-router';
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let RouteHandler = Router.RouteHandler;
import {merge} from '../../merge';

import {Dashboard} from './Dashboard/Dashboard';
import {Disclosure} from './Disclosure';
import {TravelLog} from './TravelLog/TravelLog';
import {Archive} from './Archive/Archive';
import {Revise} from './Revise/Revise';
import {ArchiveDetail} from './Archive/ArchiveDetail';
import {AppHeader} from '../AppHeader';
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
    let styles = {
      container: {
        height: '100%'
      },
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 9,
        position: 'relative'
      }
    };


    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <AppHeader style={styles.header} homelink="dashboard" />
        <RouteHandler />
      </div>
    );
  }
}

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="archiveview" path="/archiveview" handler={Archive} />
    <Route name="archivedetail" path="/archiveview/:id" handler={ArchiveDetail} />
    <Route name="dashboard" path="/dashboard" handler={Dashboard} />
    <Route name="disclosure" path="/disclosure" handler={Disclosure} />
    <Route name="travelLog" path="/travelLog" handler={TravelLog} />
    <Route name="archive" path="/archive" handler={Archive} />
    <Route name="revise" path="/revise/:id" handler={Revise} />
    <DefaultRoute handler={Dashboard} />
  </Route>
);

window.colorBlindModeOn = window.localStorage.getItem('colorBlindModeOn') === 'true';

// Then load config and re-render
createRequest()
  .get('/api/coi/config')
  .end(processResponse((err, config) => {
    if (!err) {
      window.config = config.body;
      Router.run(routes, (Handler, state) => {
        React.render(<Handler state={state} />, document.body);
      });
    }
  }));

