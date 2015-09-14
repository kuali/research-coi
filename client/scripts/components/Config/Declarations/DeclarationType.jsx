import React from 'react/addons';
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';
import EditLink from '../EditLink';
import DoneLink from '../DoneLink';
import DeleteLink from '../DeleteLink';
import {COIConstants} from '../../../../../COIConstants';

export default class Declaration extends React.Component {
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
    ConfigActions.toggleDeclarationType(this.props.type.id);
  }

  typeIsBeingEdited(type) {
    return this.props.applicationState.declarationsTypesBeingEdited[type.id] !== undefined;
  }

  getNewValue(type) {
    return this.props.applicationState.declarationsTypesBeingEdited[type.id].newValue;
  }

  nameChanged() {
    let newValue = React.findDOMNode(this.refs.typeName).value;
    ConfigActions.updateDeclarationType(this.props.type.id, newValue);
  }

  doneEditing() {
    ConfigActions.stopEditingDeclarationType(this.props.type.id);
  }

  startEditing() {
    ConfigActions.startEditingDeclarationType(this.props.type.id);
  }

  deleteType() {
    ConfigActions.deleteDeclarationType(this.props.type.id);
  }

  lookForEnter(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      this.doneEditing();
    }
  }

  render() {
    let styles = {
      container: {
        fontSize: 17,
        margin: 20
      },
      typeLabel: {
        verticalAlign: 'middle',
        paddingLeft: this.props.toggle ? 10 : 28
      },
      textbox: {
        verticalAlign: 'middle',
        marginLeft: 10,
        padding: 3,
        fontSize: 16
      },
      editLink: {
        float: 'right',
        paddingTop: 2
      },
      deleteLink: {
        float: 'right',
        paddingTop: 2,
        marginLeft: 15
      }
    };

    let type = this.props.type;

    let deleteLink;
    if (this.props.delete) {
      deleteLink = (
        <DeleteLink style={styles.deleteLink} onClick={this.deleteType} />
      );
    }

    let jsx;
    if (this.typeIsBeingEdited(type)) {
      jsx = (
        <span>
          <input ref="typeName" type="text" style={styles.textbox} value={this.getNewValue(type)} onKeyUp={this.lookForEnter} onChange={this.nameChanged} />
          <DoneLink style={styles.editLink} onClick={this.doneEditing} />
        </span>
      );
    }
    else {
      jsx = (
        <span>
          <label style={styles.typeLabel} htmlFor={'type_' + type.id}>{type.text}</label>
          {deleteLink}
          <EditLink style={styles.editLink} onClick={this.startEditing} />
        </span>
      );
    }

    let checkbox;
    if (this.props.toggle) {
      checkbox = (
        <input type="checkbox" checked={type.showing} id={'type_' + type.id} onChange={this.typeToggled} />
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        {checkbox}
        {jsx}
      </div>
    );
  }
}
