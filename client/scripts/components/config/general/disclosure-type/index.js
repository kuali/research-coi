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
import EditLink from '../../edit-link';
import DoneLink from '../../done-link';
import ConfigActions from '../../../../actions/config-actions';

export default class DisclosureType extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false
    };

    this.editType = this.editType.bind(this);
    this.doneEditing = this.doneEditing.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const checkbox = this.refs.checkbox;
    if (checkbox.checked) {
      ConfigActions.enableDisclosureType(this.props.type.typeCd);
    }
    else {
      ConfigActions.disableDisclosureType(this.props.type.typeCd);
    }
  }

  keyUp(evt) {
    if (evt.keyCode === 13) {
      this.doneEditing();
    }
  }

  editType() {
    this.setState({
      editing: true
    });
  }

  doneEditing() {
    const textbox = this.refs.label;
    ConfigActions.updateDisclosureType(this.props.type.typeCd, textbox.value);
    this.setState({
      editing: false
    });
  }

  render() {
    let jsx;
    if (this.state.editing) {
      jsx = (
        <span className={styles.dynamicSpan}>
          <input type="text" ref="label" className={styles.textbox} defaultValue={this.props.type.description} onKeyUp={this.keyUp} />
          <DoneLink onClick={this.doneEditing} className={`${styles.override} ${styles.editLink}`} />
        </span>
      );
    }
    else {
      jsx = (
        <span className={styles.dynamicSpan}>
          <label
            htmlFor={`${this.props.type.typeCd}disctype`}
            className={styles.label}
          >
            {this.props.type.description}
          </label>
          <EditLink onClick={this.editType} className={`${styles.override} ${styles.editLink}`} />
        </span>
      );
    }

    let checkbox;
    if (this.props.canToggle) {
      checkbox = (
        <input
          ref="checkbox"
          id={`${this.props.type.typeCd}disctype`}
          type="checkbox"
          className={styles.checkbox}
          checked={this.props.type.enabled === 1}
          onChange={this.toggle}
        />
      );
    }

    return (
      <span className={classNames('fill', styles.container, this.props.className)}>
        {checkbox}
        {jsx}
      </span>
    );
  }
}
