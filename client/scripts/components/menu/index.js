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

import styles from './style';
import React from 'react';

export default class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      showing: false
    };

    this.click = this.click.bind(this);
    this.bodyClick = this.bodyClick.bind(this);
  }

  bodyClick(evt) {
    let currentNode = evt.target;
    while (
      currentNode.nodeName !== 'BODY' &&
      currentNode !== null &&
      !currentNode.hasAttribute('data-menu')
    ) {
      currentNode = currentNode.parentNode;
    }

    if (currentNode.nodeName === 'BODY') {
      this.setState({showing: false});
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.bodyClick);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.bodyClick);
  }

  click() {
    this.setState({
      showing: !this.state.showing
    });
  }

  render() {
    let content;
    if (this.state.showing) {
      content = (
        <div className={styles.content} data-menu="true">
          <i className={`fa fa-caret-up ${styles.arrow}`} />
          {this.props.children}
        </div>
      );
    }

    return (
      <span className={`${styles.container} ${this.props.className}`}>
        <button
          className={styles.button}
          onClick={this.click}
          id="menuButton"
        >
          <i className={`fa fa-cog ${styles.gearIcon}`} />
          <label htmlFor="menuButton" className={styles.label}>
            MENU
          </label>
        </button>
        {content}
      </span>
    );
  }
}
