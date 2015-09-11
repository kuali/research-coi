import React from 'react/addons';
import {merge} from '../../../merge';
import EditLink from '../EditLink';
import DoneLink from '../DoneLink';
import ConfigActions from '../../../actions/ConfigActions';

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
    let checkbox = React.findDOMNode(this.refs.checkbox);
    if (checkbox.checked) {
      ConfigActions.enableDisclosureType(this.props.type.id);
    }
    else {
      ConfigActions.disableDisclosureType(this.props.type.id);
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
    let textbox = React.findDOMNode(this.refs.label);
    ConfigActions.updateDisclosureType(this.props.type.id, textbox.value);
    this.setState({
      editing: false
    });
  }

  render() {
    let styles = {
      container: {
        width: '50%',
        display: 'inline-block'
      },
      editLink: {
        marginLeft: 10
      },
      checkbox: {
        marginRight: 10
      },
      textbox: {
        verticalAlign: 'middle',
        padding: 3,
        fontSize: 16
      }
    };

    let jsx;
    if (this.state.editing) {
      jsx = (
        <span>
          <input type="text" ref="label" style={styles.textbox} defaultValue={this.props.type.label} onKeyUp={this.keyUp} />
          <DoneLink onClick={this.doneEditing} style={styles.editLink} />
        </span>
      );
    }
    else {
      jsx = (
        <span>
          <label htmlFor={this.props.type.id + 'disctype'}>{this.props.type.label}</label>
          <EditLink onClick={this.editType} style={styles.editLink} />
        </span>
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <input
          ref="checkbox"
          id={this.props.type.id + 'disctype'}
          type="checkbox"
          style={styles.checkbox}
          defaultChecked={this.props.type.enabled}
          onChange={this.toggle}
        />
        {jsx}
      </span>
    );
  }
}
