import React from 'react/addons';
import {merge} from '../../merge';

export default class DoneWithFilterButton extends React.Component {
  render() {
    let styles = {
      container: {
        height: 27
      },
      closeLink: {
        float: 'right',
        cursor: 'pointer',
        marginRight: 10,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 13
      },
      x: {
        fontSize: 17,
        paddingRight: 5,
        display: 'inline-block'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)} onClick={this.props.onClick}>
        <span onClick={this.done} style={styles.closeLink}>
          <i className="fa fa-times" style={styles.x}></i>
          CLOSE
        </span>
      </div>
    );
  }
}
