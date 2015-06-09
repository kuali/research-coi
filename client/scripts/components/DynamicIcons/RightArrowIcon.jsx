import React from 'react/addons';

export class RightArrowIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} enable-background="new 0 0 32 32" viewBox="0 0 32 40" y="0px" x="0px" version="1.0">
         <path fill={this.props.style.color} id="path4" d="M 32,16 C 32,7.165 24.836,0 16,0 7.164,0 0,7.164 0,16 0,24.836 7.164,32 16,32 24.836,32 32,24.835 32,16 Z M 10.249359,23.522036 17.575697,16.130849 10.319565,9.2190559 13.315342,6.1108676 23.335577,16.222031 13.625245,26.510375 Z" />
      </svg>
    );
  }
}

RightArrowIcon.defaultProps = {
  style: {
    color: 'white'
  }
};