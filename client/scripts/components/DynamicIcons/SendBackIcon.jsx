import React from 'react/addons';

export class SendBackIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 30 30" enable-background="new 0 0 47 44.7" role="img" aria-labelledby="title">
        <title id="title">Send Back Icon</title>
        <g>
          <path fill={this.props.style.color} d="M26.9,14.4c0,0.2,0,0.5,0,0.7c-0.3,5.2-3.8,9.5-8.5,11c-0.1,0-0.1,0-0.2,0c-1.1,0.3-2.3,0.5-3.5,0.5
            c-0.5,0-1,0-1.5-0.1c-6-0.7-10.7-5.9-10.7-12.1c0-6.8,5.5-12.2,12.2-12.2C21.4,2.1,26.9,7.6,26.9,14.4z"/>
          <path fill="#FFFFFF" d="M19.4,19.6c-3,2.9-7.3,2.4-9.8-0.1s-2.8-6.9,0.2-9.8L11,11c-2.1,2.1-2.2,5.2-0.2,7.3s5.2,2.1,7.3,0.1
            c1.6-1.5,1.9-4.5,0.3-6.6l-0.8,0.7l-0.9-3.7l3.7,1l-0.7,0.7C21.8,13.1,21.8,17.2,19.4,19.6z"/>
        </g>
      </svg>
    );
  }
}

SendBackIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
