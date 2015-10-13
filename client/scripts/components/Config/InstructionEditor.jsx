import React from 'react/addons';
import {merge} from '../../merge';
import ConfigActions from '../../actions/ConfigActions';

export default class InstructionEditor extends React.Component {
  constructor(props) {
    super();

    this.state = {
      open: props.value && props.value.length > 0
    };

    this.toggle = this.toggle.bind(this);
    this.textChanged = this.textChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.value && nextProps.value.length > 0
    });
  }

  textChanged() {
    let textarea = React.findDOMNode(this.refs.textarea);
    ConfigActions.setInstructions(this.props.step, textarea.value);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        marginBottom: 20,
        borderRadius: 5,
        overflow: 'hidden'
      },
      flipper: {
        position: 'absolute',
        right: 22,
        transform: this.state.open ? 'rotateZ(-180deg)' : 'rotateZ(0deg) translateY(-3px)',
        transition: 'transform .3s linear',
        fontSize: 25
      },
      top: {
        padding: '10px 20px',
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: 18
      },
      bottom: {
        borderTop: '1px solid #AAA',
        padding: '15px 27px 21px 27px',
        zIndex: 1,
        position: 'relative',
        marginTop: this.state.open ? 0 : -146,
        transition: 'margin-top .3s ease-out'
      },
      textarea: {
        width: '100%',
        height: 85,
        fontSize: 16,
        padding: 10,
        borderRadius: 5,
        border: '1px solid #AAA'
      },
      label: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingBottom: 2,
        color: '#555',
        display: 'block'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.top} onClick={this.toggle}>
          {this.props.step} Instructions
          <span style={styles.flipper}>
            <i className="fa fa-caret-down"></i>
          </span>
        </div>
        <div style={{overflow: 'hidden'}}>
          <div style={styles.bottom}>
            <label htmlFor="instructionText" style={styles.label}>INSTRUCTION TEXT</label>
            <div>
              <textarea
                id="instructionText"
                style={styles.textarea}
                placeholder="Type instructions here"
                onChange={this.textChanged}
                ref="textarea"
                value={this.props.value}
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
