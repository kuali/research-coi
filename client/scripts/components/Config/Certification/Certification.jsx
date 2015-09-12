import React from 'react/addons';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import UndoButton from '../UndoButton';
import InstructionEditor from '../InstructionEditor';
import ConfigActions from '../../../actions/ConfigActions';
import ConfigStore from '../../../stores/ConfigStore';

export default class Certification extends React.Component {
  constructor() {
    super();

    this.state = {
    };

    this.onChange = this.onChange.bind(this);
    this.textChanged = this.textChanged.bind(this);
    this.requiredChanged = this.requiredChanged.bind(this);
  }

  componentDidMount() {
    this.onChange();
    ConfigStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = ConfigStore.getState();
    this.setState({
      certificationOptions: storeState.certificationOptions
    });
  }

  textChanged() {
    let textarea = React.findDOMNode(this.refs.textarea);
    ConfigActions.setCertificationText(textarea.value);
  }

  requiredChanged() {
    let checkbox = React.findDOMNode(this.refs.checkbox);
    ConfigActions.setCertificationRequired(checkbox.checked);
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
        height: 160,
        padding: 10,
        fontSize: 16,
        margin: '2px 0 30px 0',
        borderRadius: 5,
        border: '1px solid #AAA'
      },
      details: {
        padding: '3px 15px 12px 15px'
      },
      requireLabel: {
        paddingLeft: 8,
        fontSize: 14
      },
      textLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        paddingBottom: 2
      }
    };

    let details;
    if (this.state.certificationOptions) {
      details = (
        <div>
          <label htmlFor="certText" style={styles.textLabel}>CERTIFICATION TEXT</label>
          <textarea id="certText" ref="textarea" style={styles.textarea} value={this.state.certificationOptions.text} onChange={this.textChanged} />
          <div>
            <input type="checkbox" ref="checkbox" id="requiredagreement" checked={this.state.certificationOptions.required} onChange={this.requiredChanged} />
            <label style={styles.requireLabel} htmlFor="requiredagreement">Require checkbox agreement</label>
          </div>
        </div>
      );
    }

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
                  {details}
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
