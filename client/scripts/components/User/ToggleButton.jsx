import React from 'react/addons';
import {merge} from '../../merge';

export default class ToggleButton extends React.Component {
  constructor() {
    super();

    this.clicked = this.clicked.bind(this);
  }

  clicked() {
    this.props.onClick(this.props.value);
  }

  render() {
    let styles = {
      button: {
        backgroundColor: 'white',
        border: '1px solid #bbb',
        padding: '8px 20px',
        fontSize: 12,
        position: 'relative'
      },
      selected: {
        backgroundColor: '#1481A3',
        fontWeight: 'bold',
        color: 'white',
        zIndex: 2
      },
      unselected: {
        boxShadow: '0 0 15px #cecece'
      },
      arrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        border: '7px solid transparent',
        borderTopColor: window.config.colors.two,
        top: 31,
        right: '44%'
      }
    };

    let arrow;
    if (this.props.isSelected) {
      arrow = (
        <div style={styles.arrow}></div>
      );
    }

    return (
      <button
        style={
          merge(
            styles.button,
            this.props.style,
            this.props.isSelected ? styles.selected : styles.unselected
          )
        }
        onClick={this.clicked}
        value={this.props.value.code}>
        {this.props.value.description}
        {arrow}
      </button>
    );
  }
}
