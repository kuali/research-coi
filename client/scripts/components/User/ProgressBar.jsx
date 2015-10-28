import React from 'react/addons';
import {merge} from '../../merge';

export class ProgressBar extends React.Component {
  render() {
    let styles = {
      container: {
        width: '100%',
        height: 15
      },
      bar: {
        width: this.props.percentage + '%',
        backgroundColor: window.config.colors.two,
        height: '100%',
        transition: 'width .2s ease-in-out'
      }
    };
    return (
      <div style={merge(styles.container, this.props.style)} onClick={this.props.onClick}>
        <div style={styles.bar}></div>
      </div>
    );
  }
}
