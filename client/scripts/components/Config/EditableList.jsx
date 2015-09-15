import React from 'react/addons';
import {merge} from '../../merge';
import PencilIcon from '../DynamicIcons/PencilIcon';
import CheckmarkIcon from '../DynamicIcons/CheckmarkIcon';
import {PlusIcon} from '../DynamicIcons/PlusIcon';
import {COIConstants} from '../../../../COIConstants';

class EditableItem extends React.Component {
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
      let textbox = React.findDOMNode(this.refs.textbox);
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
      this.done();
    }
  }

  done() {
    this.setState({
      editing: false
    });

    let textbox = React.findDOMNode(this.refs.textbox);
    this.props.onEdit(this.props.id, this.props.typeCd, textbox.value);
  }

  render() {
    let styles = {
      container: {
        marginBottom: 8
      },
      editIcon: {
        width: 35,
        height: 18,
        color: '#048EAF',
        verticalAlign: 'middle',
        padding: '0 10px',
        cursor: 'pointer'
      },
      deleteIcon: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold',
        verticalAlign: 'middle',
        padding: '0 10px',
        cursor: 'pointer'
      },
      textbox: {
        padding: 5,
        fontSize: 15,
        borderRadius: 4,
        border: '1px solid #B0B0B0',
        marginLeft: 5
      },
      text: {
        marginLeft: 10,
        verticalAlign: 'middle'
      },
      checkmark: {
        width: 15,
        height: 18,
        color: '#32A03C',
        verticalAlign: 'middle'
      },
      done: {
        color: '#32A03C',
        fontSize: 13,
        cursor: 'pointer',
        marginLeft: 10,
        marginRight: 10
      }
    };

    let content;
    if (this.state.editing) {
      content = (
        <div style={merge(styles.container, this.props.style)}>
          <span onClick={this.done} style={styles.done}>
            <CheckmarkIcon style={styles.checkmark} /> Done
          </span>
          <input type="text" defaultValue={this.props.children} ref="textbox" style={styles.textbox} onKeyUp={this.keyPressed} />
        </div>
      );
    }
    else {
      content = (
        <div style={merge(styles.container, this.props.style)}>
          <PencilIcon style={styles.editIcon} onClick={this.edit} />
          <span style={styles.deleteIcon} onClick={this.delete}>X</span>
          <span style={styles.text}>{this.props.children}</span>
        </div>
      );
    }

    return content;
  }
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
  }

  add() {
    this.setState({
      adding: true
    });

    requestAnimationFrame(() => {
      let textbox = React.findDOMNode(this.refs.textbox);
      if (textbox) {
        textbox.focus();
      }
    });
  }

  delete(id) {
    let newItems = Array.from(this.props.items);
    newItems.splice(id, 1);

    this.props.onChange(newItems);
  }

  edited(id, typeCd, description) {
    let newItems = Array.from(this.props.items);
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
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      this.addItem();
    }
  }

  addItem() {
    let textbox = React.findDOMNode(this.refs.textbox);
    if (textbox.value.length > 0) {
      let newItems = Array.from(this.props.items);

      newItems.push({
        description: textbox.value
      });
      textbox.value = '';

      this.props.onChange(newItems);
    }
  }

  render() {
    let styles = {
      container: {
      },
      addAnother: {
        color: '#048EAF',
        padding: '10px 0 2px 25px',
        fontSize: 13,
        cursor: 'pointer'
      },
      checkmark: {
        color: '#32A03C',
        width: 15,
        height: 18,
        verticalAlign: 'middle'
      },
      done: {
        cursor: 'pointer',
        fontSize: 13,
        color: '#32A03C',
        paddingRight: 5
      },
      cancel: {
        cursor: 'pointer',
        fontSize: 13,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#F44336'
      },
      textbox: {
        padding: 5,
        fontSize: 15,
        borderRadius: 4,
        border: '1px solid #B0B0B0',
        marginLeft: 5
      },
      plus: {
        color: '#048EAF',
        width: 15,
        height: 15,
        verticalAlign: 'middle'
      },
      items: {
        borderLeft: '1px solid black',
        paddingLeft: 15
      }
    };

    let items;
    if (this.props.items) {
      items = this.props.items.map((item, index) => {
        return (
          <EditableItem key={index} id={index} typeCd={item.typeCd} onDelete={this.delete} onEdit={this.edited}>
            {item.description}
          </EditableItem>
        );
      });
    }

    let addAnother;
    if (this.state.adding) {
      addAnother = (
        <div style={{margin: '0 0 0 25px'}}>
          <span onClick={this.done} style={styles.done}>
            <CheckmarkIcon style={styles.checkmark} /> Done
          </span>
          <span onClick={this.cancel} style={styles.cancel}>
            <span style={{fontWeight: 'bold', marginRight: 4}}>X</span>
            Cancel
          </span>
          <input type="text" ref="textbox" style={styles.textbox} onKeyUp={this.keyPressed} />
        </div>
      );
    }
    else {
      addAnother = (
        <div onClick={this.add} style={styles.addAnother}>
          <PlusIcon style={styles.plus} /> Add Another
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.items}>
          {items}
        </div>

        {addAnother}
      </div>
    );
  }
}
