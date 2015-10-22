import React from 'react/addons';
import {merge} from '../../merge';
import PencilIcon from '../DynamicIcons/PencilIcon';

export default class EditLink extends React.Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.id);
  }

  render() {
    let styles = {
      container: {
        borderBottom: window.colorBlindModeOn ? '1px dotted black' : '1px dotted #0095A0',
        cursor: 'pointer'
      },
      linkText: {
        paddingLeft: 2,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        verticalAlign: 'middle',
        fontSize: 8
      },
      icon: {
        width: 15,
        height: 15,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        verticalAlign: 'middle'
      }
    };

    return (
      <span onClick={this.onClick} style={merge(styles.container, this.props.style)}>
        <PencilIcon style={styles.icon} />
        <span style={styles.linkText}>EDIT</span>
      </span>
    );
  }
}
