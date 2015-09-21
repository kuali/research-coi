import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {NextIcon} from '../../DynamicIcons/NextIcon';
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
    let styles = {
      icon: {
        color: '#1481A3',
        marginRight: 3,
        width: 33,
        height: 33,
        verticalAlign: 'middle'
      },
      next: {
        float: 'right',
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
        <NextIcon style={styles.icon}/>
        <span style={styles.text}>Next</span>
      </div>
    );
  }
}
