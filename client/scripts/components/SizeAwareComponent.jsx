import React from 'react/addons';

export class SizeAwareComponent extends React.Component {
  handleResize(e) {
    window.size = window.innerWidth < 800 ? 'SMALL' : 'LARGE';
    this.updateBodyOverflow();
    
    this.forceUpdate();
  }

  updateBodyOverflow() {
    document.body.style.overflow = window.size === 'SMALL' ? 'hidden' : 'initial';    
  }

  componentWillMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }
}