import React from 'react/addons';

export class SearchIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg
        style={this.props.style}
        width="210mm"
        height="297mm"
        viewBox="0 0 744.09448819 1052.3622047"
        id="svg2"
        version="1.1"
        role="img"
        aria-labelledby="title">
        <title id="title">Search Icon</title>
        <g id="layer1">
          <path
             id="path4200"
             d="M 4.0514289,715.62726 193.93846,513.90301 c -36.10276,-52.68099 -57.64797,-117.33492 -57.64797,-187.4964 0,-176.34161 134.5495,-319.2787 300.54332,-319.2787 165.99384,0 300.54333,142.93709 300.54333,319.2787 0,176.34161 -134.54949,319.2787 -300.54333,319.2787 -66.04439,0 -126.90441,-22.88831 -176.49406,-61.24167 L 70.452712,786.16791 4.0514289,715.62726 Z M 436.83381,545.9107 c 113.9247,0 206.62355,-98.47752 206.62355,-219.50409 0,-121.02658 -92.69885,-219.5041 -206.62355,-219.5041 -113.9247,0 -206.62353,98.47752 -206.62353,219.5041 0,121.02657 92.69883,219.50409 206.62353,219.50409 z"
             fill={this.props.style.color} />
        </g>
      </svg>
    );
  }
}

SearchIcon.defaultProps = {
  style: {
    color: 'white'
  }
};
