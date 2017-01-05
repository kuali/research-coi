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
import React from 'react';

export default class PopOver extends React.Component {
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
      !currentNode.hasAttribute('data-hover')
    ) {
      currentNode = currentNode.parentNode;
    }

    if (currentNode.nodeName === 'BODY') {
      this.setState({showing: false});
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.bodyClick);
    if (this.props.triggerId) {
      const element = document.getElementById(this.props.triggerId);
      if (element) {
        element.addEventListener('click', this.click);
      }
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.bodyClick);
    if (this.props.trigger) {
      const element = document.getElementById(this.props.triggerId);
      if (element) {
        element.removeEventListener('click', this.click);
      }
    }
  }

  click(evt) {
    evt.stopPropagation();
    this.setState({
      showing: !this.state.showing
    });
  }

  render() {
    const inlineStyles = Object.assign(
      {},
      this.props.style,
      {display: this.state.showing ? 'block' : 'none'}
    );

    return (
      <span
        style={inlineStyles}
        className={styles.container}
        data-hover="true"
      >
        <div className={styles.content}>
          <i className={`fa fa-caret-up ${styles.arrow}`} />
          {this.props.children}
        </div>
      </span>
    );
  }
}
