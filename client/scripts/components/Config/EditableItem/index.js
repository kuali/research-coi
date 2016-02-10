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
import CheckmarkIcon from '../../dynamic-icons/checkmark-icon';
import {COIConstants} from '../../../../../coi-constants';

export default class EditableItem extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false
    };

    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.done = this.done.bind(this);
  }

  edit() {
    this.setState({
      editing: true
    });

    requestAnimationFrame(() => {
      const textbox = this.refs.textbox;
      if (textbox) {
        textbox.focus();
      }
    });
  }

  delete() {
    this.props.onDelete(this.props.id);
  }

  keyPressed(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      evt.preventDefault();
      this.done();
    }
  }

  done() {
    this.setState({
      editing: false
    });
    const textbox = this.refs.textbox;
    this.props.onEdit(this.props.id, this.props.typeCd, textbox.value);
  }

  render() {
    let content;
    if (this.state.editing) {
      content = (
        <div className={classNames(styles.container, this.props.className)}>
          <span onClick={this.done} className={styles.done}>
            <CheckmarkIcon className={`${styles.override} ${styles.checkmark}`} color="#32A03C" />
            Done
          </span>
          <input
            type="text"
            defaultValue={this.props.children}
            ref="textbox"
            className={styles.textbox}
            onKeyDown={this.keyPressed}
          />
        </div>
      );
    }
    else {
      content = (
        <div className={classNames(styles.container, this.props.className)}>
          <i className={`fa fa-pencil ${styles.editIcon}`} onClick={this.edit}></i>
          <span className={styles.deleteIcon} onClick={this.delete}>X</span>
          <span className={styles.text}>{this.props.children}</span>
        </div>
      );
    }

    return content;
  }
}
