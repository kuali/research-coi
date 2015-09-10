import React from 'react/addons';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import UndoButton from '../UndoButton';
import InstructionEditor from '../InstructionEditor';

export default class Certification extends React.Component {
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
        backgroundColor: 'white',
        minHeight: 68
      },
      configurationArea: {
        padding: 35,
        overflowY: 'auto',
        minHeight: 0
      },
      rightPanel: {
        padding: '0 20px'
      },
      textarea: {
        width: '100%',
        height: 60,
        padding: 10,
        fontSize: 16,
        margin: '2px 0 30px 0'
      },
      details: {
        padding: '3px 15px 12px 15px'
      },
      requireLabel: {
        paddingLeft: 8,
        fontSize: 14
      }
    };

    return (
      <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
        <Sidebar active="certification" />
        <span style={styles.content} className="inline-flexbox column fill">
          <div style={styles.stepTitle}>
            Customize Certification
          </div>
          <div className="fill flexbox row" style={styles.configurationArea}>
            <span className="fill">
              <InstructionEditor step="Certification" />
              <Panel title="Certification">
                <div style={styles.details}>
                  <div>CERTIFICATION TEXT</div>
                  <textarea style={styles.textarea}>
                  </textarea>
                  <div>
                    <input type="checkbox" id="requiredagreement" />
                    <label style={styles.requireLabel} htmlFor="requiredagreement">Require checkbox agreement</label>
                  </div>
                </div>
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
