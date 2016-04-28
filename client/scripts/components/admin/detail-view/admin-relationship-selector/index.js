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
import styles from './style.css';
import { AdminActions } from '../../../../actions/admin-actions';

export default class AdminRelationshipSelector extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    AdminActions.updateAdminRelationship(
      {
        declarationId: this.props.declarationId,
        adminRelationshipCd: evt.target.value
      }
    );
  }

  render() {
    return (
      <div>
        <select className={styles.select} id="adminRelationship" value={this.props.value} onChange={this.onChange}>
          <option value=''>SELECT</option>
          {this.props.options}
        </select>
      </div>
    );
  }
}
