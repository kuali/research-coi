import React from 'react/addons';

export class RecommendedStatusIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" enable-background="new 0 0 47 44.7" role="img" aria-labelledby="title">
        <title id="title">Recommended Status Icon</title>
        <g>
          <path fill={this.props.style.color} d="M26.9,14.1c0,0.2,0,0.5,0,0.7c-0.3,5.2-3.8,9.5-8.5,11c-0.1,0-0.1,0-0.2,0c-1.1,0.3-2.3,0.5-3.5,0.5
            c-0.5,0-1,0-1.5-0.1c-6-0.7-10.7-5.9-10.7-12.1c0-6.8,5.5-12.2,12.2-12.2C21.4,1.8,26.9,7.3,26.9,14.1z"/>
          <g>
            <path fill="#FFFFFF" d="M11.1,17.9c-0.1-0.1-0.1-0.1-0.2-0.2c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.2-0.2-0.2-0.3C9.7,16.5,9,16,9,16v0
              v0v0l-0.1,0.5L8.8,17h0L8,20.2l3.8-1.1l0,0l0,0c0,0,0,0,0,0C12,19,11.6,18.5,11.1,17.9z M11.8,19.1L11.8,19.1
              C11.8,19.1,11.8,19.1,11.8,19.1z M11.8,19.1C11.8,19.1,11.8,19.1,11.8,19.1L11.8,19.1L11.8,19.1z M11.8,19.1
              C11.8,19.1,11.8,19.1,11.8,19.1L11.8,19.1C11.8,19.1,11.8,19.1,11.8,19.1L11.8,19.1z"/>
            <path fill="#FFFFFF" d="M20.4,7.5c0.8,0.8,1.4,1.7,1.2,1.9l-9.3,9.3c-0.1-0.2-0.2-0.4-0.3-0.5c-0.3-0.4-0.6-0.8-1.1-1.2
              c-0.4-0.4-0.8-0.8-1.2-1c-0.1-0.1-0.3-0.2-0.5-0.3l9.3-9.3C18.7,6.1,19.5,6.7,20.4,7.5z"/>
          </g>
        </g>
      </svg>
    );
  }
}

RecommendedStatusIcon.defaultProps = {
  style: {
    color: 'white'
  }
};