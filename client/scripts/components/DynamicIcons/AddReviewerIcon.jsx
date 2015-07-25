import React from 'react/addons';

export class AddReviewerIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" enable-background="new 0 0 47 44.7" role="img" aria-labelledby="title">
        <title id="title">Add Reviewer Icon</title>
        <g>
          <polygon fill="#FFFFFF" points="5.8,21.1 5.8,21.1 5.8,21.1 5.8,21.1   "/>
          <path fill="#FFFFFF" d="M5.8,21.1L5.8,21.1C5.8,21.1,5.8,21.1,5.8,21.1z"/>
          <polygon fill="#FFFFFF" points="5.8,21.1 5.8,21.1 5.8,21.1  "/>
          <polygon fill="#FFFFFF" points="5.8,21.1 5.8,21.1 5.8,21.1  "/>
          <path fill="#FFFFFF" d="M5.8,21.1C5.8,21.1,5.8,21.1,5.8,21.1L5.8,21.1z"/>
          <polygon fill="#FFFFFF" points="5.8,21.1 5.8,21.1 5.8,21.1 5.8,21.1   "/>
          <path fill="#FFFFFF" d="M5.8,21.1L5.8,21.1C5.8,21.1,5.8,21.1,5.8,21.1z"/>
          <polygon fill="#FFFFFF" points="5.8,21.1 5.8,21.1 5.8,21.1  "/>
          <path fill="#FFFFFF" d="M5.8,21.1L5.8,21.1C5.8,21.1,5.8,21.1,5.8,21.1z"/>
          <polygon fill="#FFFFFF" points="5.8,21.1 5.8,21.1 5.8,21.1  "/>
          <path fill={this.props.style.color} d="M26.9,14.4c0,0.2,0,0.5,0,0.7c-0.3,5.2-3.8,9.5-8.5,11c-0.1,0-0.1,0-0.2,0c-1.1,0.3-2.3,0.5-3.5,0.5
            c-0.5,0-1,0-1.5-0.1c-6-0.7-10.7-5.9-10.7-12.1c0-6.8,5.5-12.2,12.2-12.2C21.4,2.1,26.9,7.6,26.9,14.4z"/>
          <rect x="8.8" y="11.9" fill="#FFFFFF" width="11.2" height="5"/>
          <rect x="11.9" y="8.7" fill="#FFFFFF" width="5" height="11.2"/>
        </g>
      </svg>
    );
  }
}

AddReviewerIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
