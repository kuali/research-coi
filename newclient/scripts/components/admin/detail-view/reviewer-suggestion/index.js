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
export default class ReviewerSuggestion extends React.Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.suggestion);
  }

  highlightSearchTerm(value, searchTerm) {
    if (!searchTerm) {
      return value;
    }
    const start = value.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (start >= 0) {
      const matchingValue = value.substr(start, searchTerm.length);
      return (
        <span>
          <span style={{display: 'inline'}}>{String(value.substr(0, start))}</span>
          <span className={'highlight'}>
            {matchingValue}
          </span>
          <span style={{display: 'inline'}}>{value.substr(start + searchTerm.length)}</span>
        </span>
      );
    }

    return value;
  }

  render() {
    const classes = classNames(
      styles.suggestion,
      {[styles.selected]: this.props.selected}
    );

    return (
      <li
        className={classes}
        onClick={this.onClick}
        role="option"
      >
        <div className={styles.name}>
          {this.highlightSearchTerm(this.props.suggestion.value, this.props.searchTerm)}
        </div>
        <div className={styles.email}>
          {this.props.suggestion.email}
        </div>
      </li>
    );
  }
}
