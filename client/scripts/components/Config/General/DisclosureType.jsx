import React from 'react/addons';
import {merge} from '../../../merge';
import EditLink from '../EditLink';
import DoneLink from '../DoneLink';
import ConfigActions from '../../../actions/ConfigActions';

export default class DisclosureType extends React.Component {
  constructor() {
    super();

    this.editType = this.editType.bind(this);
    this.doneEditing = this.doneEditing.bind(this);
  }

  editType() {
    ConfigActions.startEditingDisclosureType(this.props.id);
  }

  doneEditing() {
    let textbox = React.findDOMNode(this.refs.label);
    ConfigActions.updateDisclosureType(this.props.id, textbox.value);
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
    if (this.props.editMode) {
      jsx = (
        <span style={merge(styles.container, this.props.style)}>
          <input id="travel" type="checkbox" style={styles.checkbox} />
          <input type="text" ref="label" style={styles.textbox} defaultValue={this.props.label} />
          <DoneLink onClick={this.doneEditing} style={styles.editLink} />
        </span>
      );
    }
    else {
      jsx = (
        <span style={merge(styles.container, this.props.style)}>
          <input id="travel" type="checkbox" style={styles.checkbox} />
          <label htmlFor="travel">{this.props.label}</label>
          <EditLink onClick={this.editType} style={styles.editLink} />
        </span>
      );
    }

    return jsx;
  }
}
