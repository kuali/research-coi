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

import styles from './style';
import classNames from 'classnames';
import React from 'react';

export class DisclosureFilterSearch extends React.Component {
  constructor() {
    super();
    this.valueChanged = this.valueChanged.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
    if (this.props.onSearch) {
      this.props.onSearch();
    }
  }

  keyUp(evt) {
    if (evt.keyCode === 13 && this.props.onSearch) {
      this.props.onSearch();
    }
  }

  valueChanged(evt) {
    this.props.onChange(evt.target.value);
  }

  render() {
    const currentValue = this.props.query || '';
    return (
      <div className={classNames(styles.container, this.props.className)}>
        <i className={classNames('fa', 'fa-search', styles.magnifyingGlass)} onClick={this.search} />
        <input
          aria-label="Search"
          placeholder="Search"
          className={styles.input}
          type="text"
          onChange={this.valueChanged}
          onKeyUp={this.keyUp}
          value={currentValue}
        />
      </div>
    );
  }
}
