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
import {merge} from '../merge';

export default class VerticalSlider extends React.Component {
  componentWillMount() {
    this.setState({
      collapsed: this.props.collapsed
    });
  }

  componentDidMount() {
    this.setState({
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
    let styles = {
      container: {
      },
      content: {
        transition: 'transform .1s ease-out',
        transform: this.state.collapsed ? 'translateY(-100%)' : 'translateY(0%)',
        position: 'absolute',
        top: 0
      },
      spacer: {
        height: this.state.collapsed ? 0 : this.state.height,
        transition: 'height .1s ease-out'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div ref="content" style={styles.content}>
          {this.props.children}
        </div>
        <div style={styles.spacer}></div>
      </div>
    );
  }
}
