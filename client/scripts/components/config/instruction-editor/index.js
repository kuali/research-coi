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
import classNames from 'classnames';
import React from 'react';
import ConfigActions from '../../../actions/config-actions';

export default class InstructionEditor extends React.Component {
  constructor(props) {
    super();

    this.state = {
      open: props.value && props.value.length > 0
    };

    this.toggle = this.toggle.bind(this);
    this.textChanged = this.textChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.value && nextProps.value.length > 0
    });
  }

  textChanged() {
    const textarea = this.refs.textarea;
    ConfigActions.setInstructions(this.props.step, textarea.value);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const classes = classNames(
      styles.container,
      this.props.className,
      {[styles.open]: this.state.open}
    );

    return (
      <div className={classes}>
        <div className={styles.top} onClick={this.toggle}>
          {this.props.step}
          <span style={{marginLeft: 3}}>Instructions</span>
          <span className={styles.flipper}>
            <i className={`fa fa-caret-down`}></i>
          </span>
        </div>
        <div style={{overflow: 'hidden'}}>
          <div className={styles.bottom}>
            <label htmlFor="instructionText" className={styles.label}>INSTRUCTION TEXT</label>
            <div>
              <textarea
                id="instructionText"
                className={styles.textarea}
                placeholder="Type instructions here"
                onChange={this.textChanged}
                ref="textarea"
                value={this.props.value}
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
