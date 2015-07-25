import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';

export class Flag extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        padding: '8px 13px',
        fontSize: 15,
        display: 'inline-block',
        color: 'white'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let text;
    switch (this.props.type) {
      case 'NONE':
        text = 'NO CONFLICT';
        styles.container.backgroundColor = '#e0e0e0';
        styles.container.color = 'black';
        break;
      case 'POTENTIAL':
        text = 'POTENTIAL RELATIONSHIP';
        styles.container.backgroundColor = '#535353';
        break;
      case 'MANAGED':
        text = 'MANAGED RELATIONSHIP';
        styles.container.backgroundColor = '#434343';
        break;
      case 'ATTENTION':
        text = 'ATTENTION REQUIRED';
        styles.container.backgroundColor = 'black';
        styles.container.fontWeight = 'bold';
        break;
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        {text}
      </span>
    );
  }
}
