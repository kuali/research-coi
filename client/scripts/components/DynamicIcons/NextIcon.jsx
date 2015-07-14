import React from 'react/addons';

export class NextIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style}>
        <path fill={this.props.style.color} d="M29.6,17.8c0,0.2,0,0.5,0,0.7c-0.3,5.2-3.8,9.5-8.5,11c-0.1,0-0.1,0-0.2,0c-1.1,0.3-2.3,0.5-3.5,0.5
          c-0.5,0-1,0-1.5-0.1c-6-0.7-10.7-5.9-10.7-12.1c0-6.8,5.5-12.2,12.2-12.2C24.1,5.6,29.6,11.1,29.6,17.8z"/>
        <polygon fill="#FFFFFF" points="10,16 10,20 16,20 16,23 24.5,18.1 16,13.2 16,16 "/>
      </svg>
    );
  }
}

NextIcon.defaultProps = {
  style: {
    color: 'white'
  }
};