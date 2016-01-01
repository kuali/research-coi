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

import React from 'react';
import {merge} from '../../merge';

export default class Badge extends React.Component {
  constructor() {
    super();

    this.onDelete = this.onDelete.bind(this);
  }

  onDelete() {
    this.props.onDelete(this.props.id);
  }

  render() {
    const styles = {
      container: {
        borderRadius: 5,
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        color: 'white',
        fontSize: 12,
        padding: '6px 7px',
        textShadow: '1px 1px 1px #042E38'
      },
      X: {
        fontWeight: 'bold',
        fontSize: 12,
        cursor: 'pointer',
        paddingLeft: 6,
        textShadow: '0'
      }
    };

    return (
      <span style={merge(styles.container, this.props.style)}>
        {this.props.children}
        <span style={styles.X} onClick={this.onDelete}>X</span>
      </span>
    );
  }
}
