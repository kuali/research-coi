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
import ConfigActions from '../../../../actions/config-actions';
import EditLink from '../../edit-link';
import DoneLink from '../../done-link';
import DeleteLink from '../../delete-link';
import {COIConstants} from '../../../../../../coi-constants';

export default class DeclarationType extends React.Component {
  constructor() {
    super();

    this.typeIsBeingEdited = this.typeIsBeingEdited.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
    this.doneEditing = this.doneEditing.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.deleteType = this.deleteType.bind(this);
    this.lookForEnter = this.lookForEnter.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  typeIsBeingEdited(type) {
    return this.props.applicationState.dispositionTypesBeingEdited[type.typeCd] !== undefined;
  }

  moveUp() {
    ConfigActions.moveArrayElement({
      path: 'config.dispositionTypes',
      index: this.props.index,
      direction: -1
    });
  }

  moveDown() {
    ConfigActions.moveArrayElement({
      path: 'config.dispositionTypes',
      index: this.props.index,
      direction: 1
    });
  }

  nameChanged(evt) {
    ConfigActions.set({
      path: `config.dispositionTypes[${this.props.index}].description`,
      value: evt.target.value
    });
  }

  doneEditing() {
    ConfigActions.set({
      path:`applicationState.dispositionTypesBeingEdited[${this.props.type.typeCd}]`,
      value: undefined
    });
  }

  startEditing() {
    ConfigActions.set({
      path:`applicationState.dispositionTypesBeingEdited[${this.props.type.typeCd}]`,
      value: {}
    });
  }

  deleteType() {
    ConfigActions.removeFromArray({
      path: `config.dispositionTypes`,
      index: this.props.index
    });
  }

  lookForEnter(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      this.doneEditing();
    }
  }

  render() {
    const type = this.props.type;
    let jsx;
    if (this.typeIsBeingEdited(type)) {
      jsx = (
        <span>

          <input
            type="text"
            className={styles.textbox}
            value={this.props.type.description}
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
          <DeleteLink className={`${styles.override} ${styles.deleteLink}`} onClick={this.deleteType} />
          <EditLink className={`${styles.override} ${styles.editLink}`} onClick={this.startEditing} />
        </span>
      );
    }

    const classes = classNames(
      styles.container,
      this.props.className,
      {[styles.toggle]: this.props.toggle}
    );

    let upSytle;
    let downStyle;

    if (this.props.index === 0) {
      upSytle = {display: 'none'};
    }

    if (this.props.last) {
      downStyle = {display: 'none'};
    }


    return (
      <div className={classes}>
        <div style={{display: 'inline-block', width:'50px'}}>
          <div style={{display: 'inline-block', width: '45%'}}>
            <button className={styles.button} style={upSytle} onClick={this.moveUp}> <i className={`fa fa-arrow-up`}></i></button>
          </div>
          <div style={{display: 'inline-block', width: '45%'}}>
            <button className={styles.button} style={downStyle} onClick={this.moveDown}><i className={`fa fa-arrow-down`}></i></button>
          </div>
        </div>
        {jsx}
      </div>
    );
  }
}
