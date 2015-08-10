import React from 'react/addons';
import {merge} from '../../merge';
import {DeleteIcon} from '../DynamicIcons/DeleteIcon';

export default class UndoButton extends React.Component {
  render() {
    let styles = {
      container: {
        cursor: 'pointer'
      },
      undoIcon: {
        width: 30,
        height: 35,
        color: '#EC6F41',
        verticalAlign: 'middle'
      },
      undoText: {
        verticalAlign: 'middle',
        paddingLeft: 10,
        fontSize: 15,
        color: '#525252'
      }
    };

    return (
      <span onClick={this.props.onClick} style={merge(styles.container, this.props.style)}>
        <DeleteIcon style={styles.undoIcon} />
        <span style={styles.undoText}>UNDO CHANGES</span>
      </span>
    );
  }
}
