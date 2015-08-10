import React from 'react/addons';

export default class PencilIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" aria-labelledby="title">
        <title id="title">Pencil Icon</title>
        <path fill={this.props.style.color} d="M77.4,10.8c-1.6-1.6-3.8-2.4-5.9-2.4s-4.3,0.8-5.9,2.4L22.4,54L46,77.6l43.2-43.2c3.3-3.3,3.3-8.5,0-11.8  L77.4,10.8z"/>
        <polygon fill={this.props.style.color} points="39.8,83.2 16.8,60.2 8.3,91.7 "/>
      </svg>
    );
  }
}

PencilIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
