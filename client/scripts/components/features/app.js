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
import {processResponse, createRequest} from '../../http-utils';
import Flag from './flag';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      flags: []
    };

    this.save = this.save.bind(this);
  }

  componentDidMount() {
    createRequest()
      .get('/api/coi/features')
      .end(processResponse((err, response) => {
        if (!err) {
          this.setState({
            flags: response.body
          });
        }
      }));
  }

  save(theKey, newValue) {
    const flagToToggle = this.state.flags.find(flag => flag.key === theKey);
    flagToToggle.active = newValue;
    this.setState({
      flags: this.state.flags
    });

    createRequest()
      .put(`/api/coi/features/${theKey}`)
      .send({
        active: newValue
      })
      .end(processResponse(() => {}));
  }

  render() {
    const flags = this.state.flags.map(flag => {
      return (
        <Flag
          key={flag.key}
          name={flag.key}
          onChange={this.save}
          active={flag.active}
        />
      );
    });

    return (
      <div>
        <h1>Feature Flags</h1>
        {flags}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#theApp'));
