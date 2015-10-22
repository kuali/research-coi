import React from 'react/addons';

export class ResponsiveComponent extends React.Component {
  constructor() {
    super();
    this.windowSize = window.size;
  }

  render() {
    if (window.size === 'SMALL') {
      return this.renderMobile();
    }
    else {
      return this.renderDesktop();
    }
  }
}
