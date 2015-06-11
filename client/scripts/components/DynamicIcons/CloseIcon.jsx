import React from 'react/addons';

export class CloseIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} viewBox="0 0 90 113.75">
        <path fill={this.props.style.color} fill-rule="evenodd" d="M47.247 44.918l14.495 14.496c.78.78.78 2.047 0 2.828-.78.78-2.047.78-2.828 0L44.418 47.747 29.94 62.224c-.78.78-2.046.78-2.827 0-.78-.78-.78-2.048 0-2.83L41.59 44.92 27.694 31.023c-.78-.78-.78-2.048 0-2.83.78-.78 2.048-.78 2.83 0L44.417 42.09l14.477-14.477c.78-.78 2.048-.78 2.83 0 .78.78.78 2.047 0 2.828L47.246 44.92zM76.82 77.32c17.573-17.574 17.573-46.066 0-63.64-17.574-17.573-46.066-17.573-63.64 0-17.573 17.574-17.573 46.066 0 63.64 17.574 17.573 46.066 17.573 63.64 0z"/>
      </svg>
    );
  }
}

CloseIcon.defaultProps = {
  style: {
    color: 'white'
  }
};