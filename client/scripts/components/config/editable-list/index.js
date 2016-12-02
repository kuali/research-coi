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
import EditableItem from '../editable-item';

function reassignOrders(items) {
  items.forEach((item, index) => { item.order = index; });
  return items;
}

export default class EditableList extends React.Component {
  constructor() {
    super();

    this.state = {};

    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
    this.done = this.done.bind(this);
    this.cancel = this.cancel.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.edited = this.edited.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  add() {
    this.setState({
      adding: true
    });

    requestAnimationFrame(() => {
      const textbox = this.refs.textbox;
      if (textbox) {
        textbox.focus();
      }
    });
  }

  moveUp(index) {
    if (index > 0) {
      const swapItem = this.props.items[index - 1];
      this.props.items[index - 1] = this.props.items[index];
      this.props.items[index] = swapItem;

      reassignOrders(this.props.items);
  
      this.props.onChange(this.props.items);
    }
  }

  moveDown(index) {
    if (index >= 0 && index < this.props.items.length - 1) {
      const swapItem = this.props.items[index + 1];
      this.props.items[index + 1] = this.props.items[index];
      this.props.items[index] = swapItem;

      reassignOrders(this.props.items);

      this.props.onChange(this.props.items);
    }
  }

  delete(id) {
    let newItems = Array.from(this.props.items);
    newItems.splice(id, 1);
    newItems = reassignOrders(newItems);
    this.props.onChange(newItems);
  }

  edited(id, typeCd, description) {
    const newItems = Array.from(this.props.items);
    newItems[id].typeCd = typeCd;
    newItems[id].description = description;

    this.props.onChange(newItems);
  }

  done() {
    this.addItem();

    this.setState({
      adding: false
    });
  }

  cancel() {
    this.setState({
      adding: false
    });
  }

  keyPressed(evt) {
    if (evt.keyCode === RETURN_KEY) {
      evt.preventDefault();
      this.addItem();
    }
  }

  addItem() {
    const textbox = this.refs.textbox;
    if (textbox.value.length > 0) {
      let newItems = Array.from(this.props.items);

      newItems.push({
        description: textbox.value
      });

      newItems = reassignOrders(newItems);

      textbox.value = '';

      this.props.onChange(newItems);
    }
  }

  render() {
    const items = this.props.items
      .sort((a, b) => a.order - b.order)
      .map((item, index, array) => {
        return (
          <EditableItem
            key={index}
            index={index}
            typeCd={item.typeCd}
            onDelete={this.delete}
            onEdit={this.edited}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            last={index === array.length - 1}
          >
            {item.description}
          </EditableItem>
        );
      });

    let addAnother;
    if (this.state.adding) {
      addAnother = (
        <div style={{margin: '0 0 0 25px'}}>
          <span onClick={this.done} className={styles.done}>
            <CheckmarkIcon
              className={`${styles.override} ${styles.checkmark}`}
              color="#32A03C"
            />
            Done
          </span>
          <span onClick={this.cancel} className={styles.cancel}>
            <span style={{fontWeight: 'bold', marginRight: 4}}>X</span>
            Cancel
          </span>
          <input
            type="text"
            ref="textbox"
            className={styles.textbox}
            onKeyDown={this.keyPressed}
          />
        </div>
      );
    }
    else {
      addAnother = (
        <div onClick={this.add} className={styles.addAnother}>
          <i className={`fa fa-plus ${styles.plus}`} />Add Another
        </div>
      );
    }

    return (
      <div className={this.props.className}>
        <div className={styles.items}>
          {items}
        </div>

        {addAnother}
      </div>
    );
  }
}

EditableList.PropTypes = {
  className: React.PropTypes.string,
  items: React.PropTypes.array,
  onChange: React.PropTypes.func
};

EditableList.defaultProps = {
  className: '',
  items: [],
  onChange: () => {}
};
