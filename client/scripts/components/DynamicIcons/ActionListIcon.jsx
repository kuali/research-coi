import React from 'react/addons';

export class ActionListIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 47 44.7" enable-background="new 0 0 47 44.7" role="img" aria-labelledby="title">
        <title id="title">Action List Icon</title>
        <path fill={this.props.style.color} d="M23.5,5.8C14.4,5.8,7,13.2,7,22.3s7.4,16.5,16.5,16.5s16.5-7.4,16.5-16.5S32.7,5.8,23.5,5.8z M21.2,32.3c0,0-5.2-5.8-8.6-7.1c1.8-1.7,5.6-3.5,5.6-3.5l2.8,4.4c0,0,7.6-12.8,11.7-13.5c0.1,0.5-0.7,3.8,0.3,7.4C28.7,22,21.2,32.3,21.2,32.3z"/>
      </svg>
    );
  }
}

ActionListIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
