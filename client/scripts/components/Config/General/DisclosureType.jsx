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
    let textbox = React.findDOMNode(this.refs.label);
    ConfigActions.updateDisclosureType(this.props.type.typeCd, textbox.value);
    this.setState({
      editing: false
    });
  }

  render() {
    let styles = {
      container: {
      },
      editLink: {
        marginLeft: 10
      },
      checkbox: {
        marginRight: 10,
        verticalAlign: 'middle'
      },
      textbox: {
        verticalAlign: 'middle',
        padding: '3px 6px',
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #AAA'
      },
      label: {
        fontSize: 17
      },
      dynamicSpan: {
        verticalAlign: 'middle',
        display: 'inline-block'
      }
    };

    let jsx;
    if (this.state.editing) {
      jsx = (
        <span style={styles.dynamicSpan}>
          <input type="text" ref="label" style={styles.textbox} defaultValue={this.props.type.description} onKeyUp={this.keyUp} />
          <DoneLink onClick={this.doneEditing} style={styles.editLink} />
        </span>
      );
    }
    else {
      jsx = (
        <span style={styles.dynamicSpan}>
          <label htmlFor={this.props.type.typeCd + 'disctype'} style={styles.label}>{this.props.type.description}</label>
          <EditLink onClick={this.editType} style={styles.editLink} />
        </span>
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <input
          ref="checkbox"
          id={this.props.type.typeCd + 'disctype'}
          type="checkbox"
          style={styles.checkbox}
          checked={this.props.type.enabled === 1}
          onChange={this.toggle}
        />
        {jsx}
      </span>
    );
  }
}
