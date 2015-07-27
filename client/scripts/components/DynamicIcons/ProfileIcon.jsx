import React from 'react/addons';

export class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 47 44.7" enable-background="new 0 0 47 44.7" role="img" aria-labelledby="title">
        <title id="title">Profile Icon</title>
        <g>
          <path fill={this.props.style.color} d="M39.5,38H8.1c0.2-6,3.5-13.5,8.4-16.7c1.8,2,4.3,3.2,7.2,3.2c2.9,0,5.5-1.3,7.3-3.3C35.9,24.4,39.3,32,39.5,38z"/>
          <path fill={this.props.style.color} d="M32,14.8c0,2.2-0.9,4.2-2.3,5.7c-1.5,1.6-3.6,2.5-6,2.5c-2.3,0-4.4-1-5.9-2.5c-1.5-1.5-2.4-3.5-2.4-5.8c0-4.6,3.7-8.3,8.3-8.3S32,10.2,32,14.8z"/>
        </g>
      </svg>
    );
  }
}

ProfileIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
