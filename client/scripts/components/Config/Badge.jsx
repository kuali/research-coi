import React from 'react/addons';
import {merge} from '../../merge';

export default class Badge extends React.Component {
  constructor() {
    super();

    this.onDelete = this.onDelete.bind(this);
  }

  onDelete() {
    this.props.onDelete(this.props.id);
  }

  render() {
    let styles = {
      container: {
        borderRadius: 5,
        backgroundColor: '#048EAF',
        color: 'white',
        fontSize: 12,
        padding: '6px 7px',
        textShadow: '1px 1px 1px #042E38'
      },
      X: {
        fontWeight: 'bold',
        fontSize: 12,
        cursor: 'pointer',
        paddingLeft: 6,
        textShadow: '0'
      }
    };

    return (
      <span style={merge(styles.container, this.props.style)}>
        {this.props.children}
        <span style={styles.X} onClick={this.onDelete}>X</span>
      </span>
    );
  }
}
