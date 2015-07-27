import React from 'react/addons';

export class ApproveIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} viewBox="0 0 30 30" role="img" aria-labelledby="title">
        <title id="title">Approve Icon</title>
        <g>
          <path fill={this.props.style.color} d="M26.6,14.4c0,0.2,0,0.5,0,0.7c-0.3,5.2-3.8,9.5-8.5,11c-0.1,0-0.1,0-0.2,0c-1.1,0.3-2.3,0.5-3.5,0.5
            c-0.5,0-1,0-1.5-0.1c-6-0.7-10.7-5.9-10.7-12.1c0-6.8,5.5-12.2,12.2-12.2C21.1,2.1,26.6,7.6,26.6,14.4z"/>
          <polygon fill="#FFFFFF" points="12.8,20.9 8.1,15.1 9.7,13.9 12.5,17.4 18.2,8.1 19.9,9.1   "/>
        </g>
      </svg>
    );
  }
}

ApproveIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
