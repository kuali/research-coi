import React from 'react/addons';

export class InProgressIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" enable-background="new 0 0 47 44.7" role="img" aria-labelledby="title">
        <title id="title">In Progress Icon</title>
        <g>
          <path fill={this.props.style.color} d="M26.9,14.4c0,0.2,0,0.5,0,0.7c-0.3,5.2-3.8,9.5-8.5,11c-0.1,0-0.1,0-0.2,0c-1.1,0.3-2.3,0.5-3.5,0.5
            c-0.5,0-1,0-1.5-0.1c-6-0.7-10.7-5.9-10.7-12.1c0-6.8,5.5-12.2,12.2-12.2C21.4,2.1,26.9,7.6,26.9,14.4z"/>
          <circle fill="#FFFFFF" cx="14.6" cy="8.9" r="1.5"/>
          <circle opacity="0.1" fill="#FFFFFF" cx="18.7" cy="10.6" r="1.5"/>
          <circle opacity="0.2" fill="#FFFFFF" cx="20.3" cy="14.7" r="1.5"/>
          <circle opacity="0.4" fill="#FFFFFF" cx="18.6" cy="18.8" r="1.5"/>
          <circle opacity="0.55" fill="#FFFFFF" cx="14.4" cy="20.4" r="1.5"/>
          <circle opacity="0.7" fill="#FFFFFF" cx="10.4" cy="18.6" r="1.5"/>
          <circle opacity="0.8" fill="#FFFFFF" cx="8.8" cy="14.5" r="1.5"/>
          <circle opacity="0.95" fill="#FFFFFF" cx="10.6" cy="10.5" r="1.5"/>
        </g>
      </svg>
    );
  }
}

InProgressIcon.defaultProps = {
  style: {
    color: 'white'
  }
};