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
import Textarea from '../textarea';
import ConfigActions from '../../../actions/config-actions';
import Editor from '../../editor/editor';

export default class InstructionEditor extends React.Component {
  constructor(props) {
    super();

    this.state = {
      open: props.value && props.value.length > 0
    };

    this.toggle = this.toggle.bind(this);
    this.updateEditorState = (key, editorState) => {ConfigActions.updateEditorState(key, editorState);};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.value && nextProps.value.length > 0
    });
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

    let editor;
    if (this.props.editorState) {
      editor = (
        <Editor
          editorState={this.props.editorState}
          mapKey={this.props.step}
          onChange={this.updateEditorState}
        />

      );
    } else {
      editor = (
        <Textarea
          label='INSTRUCTION TEXT'
          labelClassName={styles.label}
          path={`config.general.instructions[${this.props.step}]`}
          className={styles.textarea}
          value={this.props.value}
          dirty={true}
        />
      );
    }
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
            {editor}
          </div>
        </div>
      </div>
    );
  }
}
