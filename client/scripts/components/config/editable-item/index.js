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
import CheckmarkIcon from '../../dynamic-icons/checkmark-icon';
import {RETURN_KEY} from '../../../../../coi-constants';

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
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  moveUp() {
    this.refs.container.classList.add(styles.up);
    this.refs.container.previousSibling.classList.add(styles.down);
    setTimeout(() => {
      this.refs.container.classList.remove(styles.up);
      this.refs.container.previousSibling.classList.remove(styles.down);
      this.props.onMoveUp(this.props.index);
    }, 100);
  }

  moveDown() {
    this.refs.container.classList.add(styles.down);
    this.refs.container.nextSibling.classList.add(styles.up);
    setTimeout(() => {
      this.refs.container.classList.remove(styles.down);
      this.refs.container.nextSibling.classList.remove(styles.up);
      this.props.onMoveDown(this.props.index);
    }, 100);
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
    this.props.onDelete(this.props.index);
  }

  keyPressed(evt) {
    if (evt.keyCode === RETURN_KEY) {
      evt.preventDefault();
      this.done();
    }
  }

  done() {
    this.setState({
      editing: false
    });
    const textbox = this.refs.textbox;
    this.props.onEdit(this.props.index, this.props.typeCd, textbox.value);
  }

  render() {
    let content;
    if (this.state.editing) {
      content = (
        <div className={styles.container}>
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
      let upSytle;
      let downStyle;

      if (this.props.index === 0) {
        upSytle = {display: 'none'};
      }

      if (this.props.last) {
        downStyle = {display: 'none'};
      }

      content = (
        <div className={styles.container} ref="container">
          <div style={{width: '50px', float: 'left'}}>
            <div style={{display: 'inline-block', width: '45%'}}>
              <button className={styles.button} style={upSytle} onClick={this.moveUp}>
                <i className={'fa fa-arrow-up'} />
              </button>
            </div>
            <div style={{display: 'inline-block', width: '45%'}}>
              <button className={styles.button} style={downStyle} onClick={this.moveDown}>
                <i className={'fa fa-arrow-down'} />
              </button>
            </div>
          </div>
          <i className={`fa fa-pencil ${styles.editIcon}`} onClick={this.edit} />
          <span className={styles.deleteIcon} onClick={this.delete}>X</span>
          <span className={styles.text}>{this.props.children}</span>
        </div>
      );
    }

    return content;
  }
}

EditableItem.PropTypes = {
  children: React.PropTypes.array,
  index: React.PropTypes.number.isRequired,
  last: React.PropTypes.bool,
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onMoveDown: React.PropTypes.func,
  onMoveUp: React.PropTypes.func,
  typeCd: React.PropTypes.number.isRequired
};

EditableItem.defaultProps = {
  children: [],
  last: false,
  onDelete: () => {},
  onEdit: () => {},
  onMoveDown: () => {},
  onMoveUp: () => {}
};
