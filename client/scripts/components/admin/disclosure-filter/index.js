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

  componentWillMount() {
    this.setActiveStatus(this.props);
  }

  componentWillReceiveProps(props) {
    this.setActiveStatus(props);
  }

  componentDidMount() {
    const localNode = this.refs.root;
    const eventHandler = this.handleClickOutside;
    const fn = evt => {
      let source = evt.target;

      while (source.parentNode) {
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
    if (this.clickListener) {
      document.removeEventListener('mousedown', this.clickListener);
      document.removeEventListener('touchstart', this.clickListener);
    }
  }

  render() {
    let clearButton;
    if (this.state.active) {
      clearButton = (
        <span onClick={this.clear} className={styles.clear}>
          <i className={'fa fa-times'} />
        </span>
      );
    }
    else {
      clearButton = (
        <span className={styles.clear} />
      );
    }

    const classes = classNames(
      styles.filter,
      {[styles.showing]: this.state.showing},
      {[styles.active]: this.state.active}
    );

    return (
      <div className={classes}>
        <div className={classNames(styles.container, this.props.className)} onClick={this.showHideFilter}>
          <span className={styles.label}>{this.label}</span>
          <span className={styles.arrows}>&#9654;</span>
          {clearButton}
        </div>
        <div ref="root" className={styles.popOut}>
          <span className={styles.arrow} />
          {this.renderFilter()}
        </div>
      </div>
    );
  }
}
