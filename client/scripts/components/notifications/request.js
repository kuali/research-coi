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

import React from 'react';
import Detail from './detail';
import {processResponse, createRequest} from '../../http-utils';

export default class Request extends React.Component {
  constructor() {
    super();

    this.state = {
      showingDetail: false,
      details: []
    };

    this.toggleDetail = this.toggleDetail.bind(this);
  }

  toggleDetail() {
    this.setState({
      showingDetail: !this.state.showingDetail
    });

    if (this.state.details.length === 0) {
      const receiptIds = JSON.parse(this.props.receiptIds);
      for (const id of receiptIds) {
        createRequest()
          .get(`/api/coi/notifications/${id}`)
          .end(processResponse((err, response) => {
            if (!err) {
              this.state.details.push(response.body);
              this.setState({details: this.state.details});
            }
          }));
      }
    }
  }

  render() {
    const {time, addresses} = this.props;

    let details;

    if (this.state.showingDetail) {
      details = this.state.details.map(detail => (
        <Detail
          key={detail.id}
          address={detail.address}
          status={detail.status}
          created={detail.createdAt}
          delivered={detail.deliveredAt}
          message={detail.messageHtml}
        />
      ));
    }

    const styles = {
      date: {
        width: 200,
        textDecoration: 'underline',
        color: 'blue',
        cursor: 'pointer'
      }
    };

    return (
      <div>
        <div>
          <span onClick={this.toggleDetail} style={styles.date}>
            {new Date(time).toLocaleString()}
          </span>
          <span>{addresses}</span>
        </div>

        {details}
      </div>
    );
  }
}
