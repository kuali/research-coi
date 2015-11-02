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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';
import {SearchIcon} from './DynamicIcons/SearchIcon';

export class SearchBox extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };

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

  renderMobile() {
    let mobileStyles = {
      container: {
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
      </span>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        borderRadius: 4,
        overflow: 'hidden'
      },
      button: {
        display: 'inline-block',
        backgroundColor: window.config.colors.three,
        height: 40,
        padding: '10px 11px 0 11px',
        verticalAlign: 'middle',
        border: 0,
        width: 37,
        cursor: 'pointer'
      },
      textbox: {
        display: 'inline-block',
        height: 40,
        outline: 0,
        verticalAlign: 'middle',
        fontSize: 20,
        padding: '0 6px',
        width: '82%',
        border: 0
      },
      hourglass: {
        height: 20
      },
      searchIcon: {
        width: 15,
        height: 26,
        color: 'white'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={styles.button} onClick={this.search}>
          <SearchIcon style={styles.searchIcon} />
        </span>
        <input className="fill" placeholder={this.props.placeholder} aria-label="Search here" value={this.props.value} onChange={this.valueChanged} onKeyUp={this.keyUp} style={styles.textbox} type="text" / >
      </span>
    );
  }
}
