import React from 'react/addons';

export class KualiLogo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <img src="images/kuali.png" style={this.props.style} />
    );
  }
}

KualiLogo.defaultProps = {
  style: {
    color: 'white'
  }
};
