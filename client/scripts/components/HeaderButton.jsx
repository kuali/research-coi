import React from 'react/addons';
import {merge} from '../merge';

export class HeaderButton extends React.Component {
  render() {
    let styles = {
      container: {
        padding: '8px 10px 0 10px',
        height: '100%',
        display: 'inline-block'
      },
      label: {
        color: '#676767',
        fontSize: 12,
        marginLeft: 4,
        verticalAlign: 'middle'
      },
      icon: {
        color: '#676767',
        height: 26,
        verticalAlign: 'middle',
        width: 26
      }
    };

    return (
      <span style={merge(styles.container, this.props.style)}>
        <this.props.icon style={styles.icon} />
        <span style={styles.label}>
          {this.props.label}
        </span>
      </span>
    );
  }
}
