import React from 'react/addons';

export class CurrentStepIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 42 42" enable-background="new 0 0 42 42" role="img" aria-labelledby="title">
        <title id="title">Current Step Icon</title>
        <g>
          <circle fill="#666666" cx="21" cy="20.9" r="6.1"/>
            <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="-2103.2007" y1="-11432.2627" x2="-2096.5986" y2="-11439.167" gradientTransform="matrix(2.9636 0 0 -2.9636 6240.5415 -33873.1328)">
            <stop offset="0" style={{stopColor: '#C2C2C2'}}/>
            <stop offset="1" style={{stopColor: '#4D4D4D'}}/>
          </linearGradient>
          <path fill={this.props.style.color} d="M21,6.8C13.2,6.8,6.8,13.2,6.8,21S13.2,35.2,21,35.2c2.2,0,4.4-0.5,6.3-1.5c2.7-1.3,4.9-3.5,6.3-6.1c1-2,1.6-4.2,1.6-6.6C35.2,13.2,28.8,6.8,21,6.8z M32.5,26.4c-1.3,2.7-3.5,4.9-6.3,6.1c-1.6,0.7-3.3,1.1-5.2,1.1C14,33.7,8.3,28,8.3,21S14,8.3,21,8.3S33.7,14,33.7,21C33.7,23,33.3,24.8,32.5,26.4z"/>
        </g>
      </svg>
    );
  }
}

CurrentStepIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
