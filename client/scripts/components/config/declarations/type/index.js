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
import EditLink from '../../edit-link';
import DoneLink from '../../done-link';
import DeleteLink from '../../delete-link';

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

        <div>
          <div className={styles.typeLabel}>
            {type.description}
          </div>
          <div style={{verticalAlign: 'top', display: 'inline-block'}}>
            <DeleteLink className={`${styles.override} ${styles.deleteLink}`} onClick={this.deleteType} />
            <EditLink className={`${styles.override} ${styles.editLink}`} onClick={this.startEditing} />
          </div>
        </div>
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
        <div style={{width: '50px', float: 'left'}}>
          <div style={{display: 'inline-block', width: '45%'}}>
            <button className={styles.button} style={upSytle} onClick={this.moveUp}> <i className={`fa fa-arrow-up`}></i></button>
          </div>
          <div style={{display: 'inline-block', width: '45%'}}>
            <button className={styles.button} style={downStyle} onClick={this.moveDown}><i className={`fa fa-arrow-down`}></i></button>
          </div>
        </div>
        <div style={{width: 'auto', overflow: 'hidden'}}>
          {jsx}
        </div>
      </div>

    );
  }
}