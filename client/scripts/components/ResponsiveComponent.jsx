import React from 'react/addons';
let PureRenderMixin = React.addons.PureRenderMixin;

export class ResponsiveComponent extends React.Component {
  constructor() {
    super();
    this.windowSize = window.size;
  }

  shouldComponentUpdate(nextProps, nextState) {
    let currentWindowSize = window.size;
    let shouldRender = PureRenderMixin.shouldComponentUpdate.apply(this, [nextProps, nextState]) || this.windowSize !== currentWindowSize;
    this.windowSize = currentWindowSize;
    return shouldRender;
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