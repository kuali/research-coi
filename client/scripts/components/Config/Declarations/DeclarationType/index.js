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
import ConfigActions from '../../../../actions/ConfigActions';
import EditLink from '../../EditLink';
import DoneLink from '../../DoneLink';
import DeleteLink from '../../DeleteLink';
import {COIConstants} from '../../../../../../COIConstants';

export default class DeclarationType extends React.Component {
  constructor() {
    super();

    this.typeIsBeingEdited = this.typeIsBeingEdited.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
    this.doneEditing = this.doneEditing.bind(this);
    this.typeToggled = this.typeToggled.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.deleteType = this.deleteType.bind(this);
    this.lookForEnter = this.lookForEnter.bind(this);
  }

  typeToggled() {
    ConfigActions.toggleDeclarationType(this.props.type.typeCd);
  }

  typeIsBeingEdited(type) {
    return this.props.applicationState.declarationsTypesBeingEdited[type.typeCd] !== undefined;
  }

  getNewValue(type) {
    return this.props.applicationState.declarationsTypesBeingEdited[type.typeCd].newValue;
  }

  nameChanged() {
    const newValue = this.refs.typeName.value;
    ConfigActions.updateDeclarationType(this.props.type.typeCd, newValue);
  }

  doneEditing() {
    ConfigActions.stopEditingDeclarationType(this.props.type.typeCd);
  }

  startEditing() {
    ConfigActions.startEditingDeclarationType(this.props.type.typeCd);
  }

  deleteType() {
    ConfigActions.deleteDeclarationType(this.props.type.typeCd);
  }

  lookForEnter(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      this.doneEditing();
    }
  }

  render() {
    const type = this.props.type;

    let deleteLink;
    if (this.props.delete) {
      deleteLink = (
        <DeleteLink className={`${styles.override} ${styles.deleteLink}`} onClick={this.deleteType} />
      );
    }

    let jsx;
    if (this.typeIsBeingEdited(type)) {
      jsx = (
        <span>
          <input
            ref="typeName"
            type="text"
            className={styles.textbox}
            defaultValue={type.description}
            value={this.getNewValue(type)}
            onKeyUp={this.lookForEnter}
            onChange={this.nameChanged}
          />
          <DoneLink className={`${styles.override} ${styles.editLink}`} onClick={this.doneEditing} />
        </span>
      );
    }
    else {
      jsx = (
        <span>
          <label className={styles.typeLabel} htmlFor={`type_${type.typeCd}`}>
            {type.description}
          </label>
          {deleteLink}
          <EditLink className={`${styles.override} ${styles.editLink}`} onClick={this.startEditing} />
        </span>
      );
    }

    let checkbox;
    if (this.props.toggle) {
      checkbox = (
        <input
          type="checkbox"
          checked={type.enabled === 1}
          id={`type_${type.typeCd}`}
          onChange={this.typeToggled}
        />
      );
    }

    const classes = classNames(
      styles.container,
      this.props.className,
      {[styles.toggle]: this.props.toggle}
    );

    return (
      <div className={classes}>
        {checkbox}
        {jsx}
      </div>
    );
  }
}
