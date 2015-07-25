import React from 'react/addons';

export class HomeIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 47 44.7" enable-background="new 0 0 47 44.7" role="img" aria-labelledby="title">
        <title id="title">Home Icon</title>
        <polygon fill={this.props.style.color} points="44.1,21 37,21 37,39 29,39 29,30 21,30 21,39 12,39 12,21 5.6,21 24.8,5.6 "/>
      </svg>
    );
  }
}

HomeIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
