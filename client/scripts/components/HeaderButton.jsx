import React from 'react/addons';
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';

export class HeaderButton extends ResponsiveComponent {
  render() {
    let styles = {
      container: {
        borderLeft: '1px solid ' + window.config.colors.one,
        padding: '8px 10px 0 10px',
        height: '100%',
        display: 'inline-block'
      },
      label: {
        color: 'white',
        fontSize: 12,
        marginLeft: 4,
        verticalAlign: 'middle'
      },
      icon: {
        color: window.config.colors.one,
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