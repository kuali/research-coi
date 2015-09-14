import React from 'react/addons';
import {merge} from '../../merge';
import UndoButton from './UndoButton';
import SaveButton from './SaveButton';

export default class ActionPanel extends React.Component {
  render() {
    let styles = {
      container: {
        padding: '0 20px 0 35px',
        width: 235
      },
      saveAndUndo: {
        position: 'fixed',
        transition: 'opacity .1s linear',
        opacity: this.props.visible ? 1 : 0
      }
    };

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.saveAndUndo}>
          <SaveButton style={{marginBottom: 30}} />
          <UndoButton />
        </div>
      </span>
    );
  }
}
