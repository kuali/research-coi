import React from 'react/addons';
import {merge} from '../../merge';

export default class InstructionEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false
    };

    this.toggle = this.toggle.bind(this);
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
        right: 22
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
        padding: '10px 15px',
        zIndex: 1,
        position: 'relative',
        marginTop: this.state.open ? 0 : -110,
        transition: 'margin-top .3s ease-out'
      },
      textarea: {
        width: '100%',
        height: 60,
        fontSize: 16,
        padding: 10
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.top} onClick={this.toggle}>
          {this.props.step} Instructions
          <span style={styles.flipper}>V</span>
        </div>
        <div style={{overflow: 'hidden'}}>
          <div style={styles.bottom}>
            <div>INSTRUCTION TEXT</div>
            <div>
              <textarea style={styles.textarea} placeholder="Type instructions here">
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
