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

export default class Dropdown extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.context);
  }

  render() {
    const options = this.props.options.map(option => {
      return (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      );
    });

    return (
      <select
        className={this.props.className || ''}
        id={this.props.id || ''}
        value={this.props.value}
        onChange={this.onChange}
      >
        <option value=''>{this.props.defaultLabel || 'SELECT'}</option>
        {options}
      </select>
    );
  }
}

Dropdown.propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.any,
  className: React.PropTypes.string,
  id: React.PropTypes.string,
  defaultLabel: React.PropTypes.string,
  context: React.PropTypes.any
};
