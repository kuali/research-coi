import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';

export class NextButton extends React.Component {
  constructor() {
    super();

    this.submit = this.submit.bind(this);
  }

  submit() {
    if (this.props.isValid) {
      this.props.onClick();
    }
  }

  render() {
    let iconColor = '#F57C00';
    if (!this.props.isValid) {
      iconColor = '#AAA';
    }
    else if (window.colorBlindModeOn) {
      iconColor = 'black';
    }

    let styles = {
      icon: {
        color: iconColor,
        marginRight: 3,
        width: 33,
        fontSize: 26,
        verticalAlign: 'middle'
      },
      next: {
        display: 'inline-block',
        cursor: 'pointer'
      },
      disabled: {
        color: '#AAA',
        cursor: 'default'
      },
      text: {
        verticalAlign: 'middle'
      }
    };

    let nextStyle = {};
    if (this.props.isValid) {
      nextStyle = styles.next;
    } else {
      nextStyle = merge(styles.next, styles.disabled);
    }

    return (
      <div style={nextStyle} onClick={this.submit}>
        <span style={styles.text}>NEXT</span>
        <i className="fa fa-arrow-right" style={styles.icon}></i>
      </div>
    );
  }
}
