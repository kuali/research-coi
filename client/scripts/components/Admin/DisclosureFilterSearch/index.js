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

import React from 'react'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';

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
    const styles = {
      container: {
        width: '100%',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        padding: '13px 10px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      },
      input: {
        border: 0,
        padding: '2px 3px 1px 5px',
        backgroundColor: 'white',
        outline: 0,
        height: 25,
        fontSize: 16,
        width: 175,
        verticalAlign: 'middle',
        borderRadius: '0 5px 5px 0'
      },
      magnifyingGlass: {
        width: 25,
        height: 25,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        backgroundColor: '#DFDFDF',
        paddingTop: 8,
        borderRadius: '0 5px 5px 0',
        fontSize: 11,
        transform: 'rotateY(180deg)'
      }
    };

    const currentValue = this.props.query || '';
    return (
      <div style={merge(styles.container, this.props.styles)}>
        <i className="fa fa-search" style={styles.magnifyingGlass} onClick={this.search}></i>
        <input aria-label="Search" placeholder="Search" style={styles.input} type="text" onChange={this.valueChanged} onKeyUp={this.keyUp} value={currentValue} />
      </div>
    );
  }
}
