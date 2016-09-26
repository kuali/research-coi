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
import Request from './request';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      requests: []
    };
  }

  componentDidMount() {
    createRequest()
      .get('/api/coi/notifications')
      .end(processResponse((err, response) => {
        if (!err) {
          this.setState({
            requests: response.body
          });
        }
      }));
  }

  render() {
    const requests = this.state.requests.map(request => {
      return (
        <Request
          key={request.id}
          time={request.timestamp}
          addresses={request.addresses}
          receiptIds={request.receiptIds}
        />
      );
    });

    return (
      <div>
        <h1>Last 100 Notification Requests</h1>
        {requests}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#theApp'));
