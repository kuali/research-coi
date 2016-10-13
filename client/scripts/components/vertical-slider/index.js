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

export default class VerticalSlider extends React.Component {
  componentWillMount() {
    this.setState({
      collapsed: this.props.collapsed
    });
  }

  componentDidMount() {
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      height: this.refs.content.clientHeight
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapsed && !this.props.collapsed) {
      this.setState({
        collapsed: true
      });
    }
    else if (!nextProps.collapsed && this.props.collapsed) {
      this.setState({
        collapsed: false
      });
    }
  }

  render() {
    const classes = classNames(
      {[styles.collapsed]: this.state.collapsed},
      this.props.className
    );

    const height = this.state.collapsed ? 0 : this.state.height;

    return (
      <div className={classes}>
        <div ref="content" className={styles.content}>
          {this.props.children}
        </div>
        <div className={styles.spacer} style={{height}} />
      </div>
    );
  }
}
