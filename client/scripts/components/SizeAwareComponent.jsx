import React from 'react/addons';

export class SizeAwareComponent extends React.Component {
  handleResize() {
    window.size = window.innerWidth < 100 ? 'SMALL' : 'LARGE'; // disabled for now, 800 probably a good size
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
