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

export default class Flag extends React.Component {
  constructor() {
    super();

    this.save = this.save.bind(this);
  }

  save() {
    const isChecked = this.refs.theCheckbox.checked;
    this.props.onChange(this.props.name, isChecked);
  }

  render() {
    return (
      <div>
        <input
          id={this.props.name}
          type="checkbox"
          onChange={this.save}
          ref="theCheckbox"
          checked={this.props.active}
        />
        <label htmlFor={this.props.name}>{this.props.name}</label>
      </div>
    );
  }
}
