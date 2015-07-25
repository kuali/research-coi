import React from 'react/addons';

export class DeleteIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style}>
        <g>
          <path fill={this.props.style.color} d="M17.4,5.4c-6.8,0-12.2,5.5-12.2,12.2c0,6.2,4.7,11.4,10.7,12.1c0.5,0.1,1,0.1,1.5,0.1
            c1.2,0,2.4-0.2,3.5-0.5c0,0,0.1,0,0.2-0.1c4.7-1.5,8.2-5.8,8.5-11c0-0.2,0-0.5,0-0.7C29.6,10.9,24.1,5.4,17.4,5.4z M24.1,20.7
            l-3.7,3.7l-3-3.1l-3.1,3.1l-3.7-3.7l3.1-3l-3.1-3.1l3.7-3.7l3.1,3.1l3-3.1l3.7,3.7l-3,3.1L24.1,20.7z"/>
          <g>
            <polygon fill="#FFFFFF" points="21,17.7 24.1,20.7 20.4,24.4 17.4,21.3 14.3,24.4 10.6,20.7 13.7,17.7 10.6,14.6 14.3,10.9
              17.4,14 20.4,10.9 24.1,14.6     "/>
          </g>
        </g>
      </svg>
    );
  }
}

DeleteIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
