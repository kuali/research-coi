import React from 'react/addons';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import UndoButton from '../UndoButton';
import InstructionEditor from '../InstructionEditor';
import EditableList from '../EditableList';

export default class Relationship extends React.Component {
  constructor() {
    super();

    this.state = {
      list: ['Self', 'Spouse', 'Children', 'Other']
    };

    this.itemsChanged = this.itemsChanged.bind(this);
  }

  itemsChanged(newList) {
    this.setState({
      list: newList
    });
  }

  render() {
    let styles = {
      container: {
      },
      content: {
        backgroundColor: '#eeeeee',
        boxShadow: '2px 8px 8px #ccc inset'
      },
      stepTitle: {
        boxShadow: '0 2px 8px #D5D5D5',
        fontSize: 33,
        textTransform: 'uppercase',
        padding: '15px 15px 15px 35px',
        color: '#525252',
        fontWeight: 300,
        backgroundColor: 'white'
      },
      configurationArea: {
        padding: 35
      },
      rightPanel: {
        padding: '0 20px'
      }
    };

    return (
      <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
        <Sidebar active="relationship" />
        <span style={styles.content} className="inline-flexbox column fill">
          <div style={styles.stepTitle}>
            Relationship Matrix
          </div>
          <div className="fill flexbox row" style={styles.configurationArea}>
            <span className="fill">
              <InstructionEditor step="Relationship Matrix" />
              <Panel title="Disclosure Types">
                <EditableList
                  items={this.state.list}
                  onChange={this.itemsChanged}
                />
              </Panel>
            </span>
            <span style={styles.rightPanel}>
              <UndoButton onClick={this.undo} />
            </span>
          </div>
        </span>
      </span>
    );
  }
}
