import React from 'react/addons';
import {merge} from '../../merge';
import ConfigActions from '../../actions/ConfigActions';

export default class UndoButton extends React.Component {
  constructor() {
    super();

    this.undo = this.undo.bind(this);
  }

  undo() {
    ConfigActions.undoAll();
  }

  render() {
    let styles = {
      container: {
        cursor: 'pointer'
      },
      undoIcon: {
        fontSize: 28,
        color: window.colorBlindModeOn ? 'black' : '#F57C00',
        verticalAlign: 'middle',
        marginTop: 3
      },
      undoText: {
        verticalAlign: 'middle',
        paddingLeft: 10,
        fontSize: 17,
        color: '#525252'
      }
    };

    return (
      <div className="flexbox row" onClick={this.undo} style={merge(styles.container, this.props.style)}>
        <i className="fa fa-times-circle" style={styles.undoIcon}></i>
        <span className="fill" style={styles.undoText}>CANCEL AND UNDO CHANGES</span>
      </div>
    );
  }
}
