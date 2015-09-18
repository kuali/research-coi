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
        marginRight: 10
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)} onClick={this.props.onClick}>
        <span onClick={this.done} style={styles.closeLink}>
          <span style={{fontWeight: 'bold'}}>X</span> <span>CLOSE</span>
        </span>
      </div>
    );
  }
}
