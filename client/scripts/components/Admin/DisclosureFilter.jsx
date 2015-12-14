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

export default class DisclosureFilter extends React.Component {
  constructor() {
    super();

    this.state = {
      showing: false
    };

    this.showHideFilter = this.showHideFilter.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.clear = this.clear.bind(this);
    this.close = this.close.bind(this);
  }

  showHideFilter() {
    this.setState({showing: !this.state.showing});
  }

  close() {
    this.handleClickOutside();
  }

  handleClickOutside() {
    this.setState({showing: false});
  }

  componentDidMount() {
    const localNode = this.refs.root;
    const eventHandler = this.handleClickOutside;
    const fn = evt => {
      let source = evt.target;

      while(source.parentNode) {
        if (source === localNode) {
          return;
        }
        source = source.parentNode;
      }
      eventHandler(evt);
    };

    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn);

    this.clickListener = fn;
  }

  componentWillUnmount() {
    if(this.clickListener) {
      document.removeEventListener('mousedown', this.clickListener);
      document.removeEventListener('touchstart', this.clickListener);
    }
  }

  render() {
    const styles = {
      container: {
        cursor: 'pointer',
        padding: 7,
        textAlign: 'right',
        fontSize: '.8em',
        color: '#444'
      },
      popOut: {
        position: 'absolute',
        top: -22,
        left: '100%',
        backgroundColor: 'white',
        padding: 10,
        zIndex: 1,
        display: this.state.showing ? 'block' : 'none',
        boxShadow: '2px 3px 10px #AAA',
        borderRadius: 5
      },
      arrows: {
        fontSize: 7,
        marginLeft: 4,
        verticalAlign: 'middle',
        color: 'white'
      },
      clear: {
        display: 'inline-block',
        width: 40,
        fontWeight: 'bold',
        verticalAlign: 'middle',
        color: 'white'
      },
      label: {
        verticalAlign: 'middle',
        color: 'white'
      },
      filter: {
        padding: '0 22px 0 42px',
        position: 'relative',
        backgroundColor: this.props.active ? window.colorBlindModeOn ? '#444' : '#007F88' : 'initial'
      },
      arrow: {
        width: 0,
        height: 0,
        position: 'absolute',
        left: -35,
        top: 28,
        borderTop: '12px solid transparent',
        borderRight: '19px solid white',
        borderBottom: '12px solid transparent',
        borderLeft: '17px solid transparent'
      }
    };

    let clearButton;
    if (this.props.active) {
      clearButton = (
        <span onClick={this.clear} style={styles.clear}>
          <i className="fa fa-times"></i>
        </span>
      );
    }
    else {
      clearButton = (
        <span style={styles.clear}></span>
      );
    }

    return (
      <div style={styles.filter}>
        <div style={merge(styles.container, this.props.style)} onClick={this.showHideFilter}>
          <span style={styles.label}>{this.label}</span>
          <span style={styles.arrows}>&#9654;</span>
          {clearButton}
        </div>
        <div ref="root" style={styles.popOut}>
          <span style={styles.arrow}></span>
          {this.renderFilter()}
        </div>
      </div>
    );
  }
}
