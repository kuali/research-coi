import React from 'react/addons';

export default class Gripper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} version="1.1" data-icon="menu" data-container-transform="translate(0 4)" viewBox="0 0 32 40" x="0px" y="0px" role="img" aria-labelledby="title">
        <title id="title">Gripper</title>
        <path fill={this.props.style.color} d="M0 0v3h32v-3h-32zm0 20v3h32v-3h-32zm0 20v3h32v-3h-32z" transform="translate(0 4)"/>
      </svg>
    );
  }
}

Gripper.defaultProps = {
  style: {
    color: 'white'
  }
};
