import React from 'react/addons';
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';
import {KButton} from './KButton';

export class ProminentButton extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        fontSize: 14,
        padding: '4px 12px',
        boxShadow: '2px 2px 9px #ddd'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <KButton {...this.props} style={merge(styles.container, this.props.style)}>
        {this.props.children}
      </KButton>
    );
  }
}