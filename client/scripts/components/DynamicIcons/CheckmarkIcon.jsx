import React from 'react/addons';

export default class CheckmarkIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} version="1.1" data-icon="check" data-container-transform="translate(2 15)" viewBox="0 0 128 160" x="0px" y="0px">
        <title id="title">Checkmark Icon</title>
        <path fill={this.props.style.color} d="M112.156.188l-5.469 5.844-64.906 68.938-24.188-23.688-5.719-5.594-11.188 11.438 5.719 5.594 30 29.406 5.813 5.688 5.594-5.938 70.5-74.906 5.5-5.813-11.656-10.969z" transform="translate(2 15)"/>
      </svg>
    );
  }
}

CheckmarkIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
