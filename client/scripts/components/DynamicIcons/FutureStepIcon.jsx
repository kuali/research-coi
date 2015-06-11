import React from 'react/addons';

export class FutureStepIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 42 42" enable-background="new 0 0 42 42">
        <g>
          <circle fill={this.props.style.color} cx="21" cy="21" r="5.1"/>
        </g>
      </svg>
    );
  }
}

FutureStepIcon.defaultProps = {
  style: {
    color: 'white'
  }
};