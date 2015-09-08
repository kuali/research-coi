import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class Toggle extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.props.onClick) {
      this.props.onClick(this.props.typeCd);
    }
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        whiteSpace: 'nowrap',
        padding: '5px 2px',
        fontSize: 12,
        width: 135,
        color: '#666',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0 0 15px #eee'
      },
      selected: {
        whiteSpace: 'nowrap',
        padding: '5px 2px',
        fontSize: 12,
        width: 135,
        color: 'white',
        border: '1px solid #666666',
        backgroundColor: '#1481A3',
        borderRadius: 5
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <button
        onClick={this.toggle}
        style={merge(this.props.selected ? styles.selected : styles.container, this.props.style)}>
        {this.props.text}
      </button>
    );
  }
}
