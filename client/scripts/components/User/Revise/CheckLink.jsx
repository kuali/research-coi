import React from 'react/addons';
import {merge} from '../../../merge';

export default class CheckLink extends React.Component {
  render() {
    let styles = {
      container: {
        marginRight: 20,
        cursor: this.props.disabled ? 'default' : 'pointer'
      },
      link: {
        borderBottom: this.props.disabled ? '#AAA' : this.props.checked ? '1px dashed #00D000' : '1px dashed #888',
        color: this.props.disabled ? '#AAA' : this.props.checked ? '#00D000' : '#666'
      },
      checkmark: {
        color: '#00D000',
        marginRight: 3
      }
    };

    let check;
    if (this.props.checked) {
      check = (
        <i className="fa fa-check" style={styles.checkmark}></i>
      );
    }
    return (
      <span style={merge(styles.container, this.props.style)} onClick={this.props.onClick}>
        {check}
        <span style={styles.link}>
          {this.props.children}
        </span>
      </span>
    );
  }
}
