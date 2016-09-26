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

export default function Detail({address, status, created, delivered, message}) {
  const styles = {
    label: {
      fontStyle: 'italic',
      fontWeight: 'bold',
      width: 120
    },
    content: {
      margin: '10px 0 50px',
      backgroundColor: '#c4d2d1',
      padding: 10
    }
  };

  const messageHtml = {
    __html: message
  };

  return (
    <div style={styles.content}>
      <div>
        <div>
          <span style={styles.label}>Address:</span>
          {address}</div>
        <div>
          <span style={styles.label}>Status:</span>
          {status}</div>
        <div>
          <span style={styles.label}>Created:</span>
          {new Date(created).toLocaleString()}</div>
        <div>
          <span style={styles.label}>Delivered:</span>
          {new Date(delivered).toLocaleString()}</div>
      </div>
      <div>
        <div>
          <span style={styles.label}>Message Sent:</span>
        </div>
        <div
          style={{backgroundColor: 'white'}}
          dangerouslySetInnerHTML={messageHtml}
        />
      </div>
    </div>
  );
}
