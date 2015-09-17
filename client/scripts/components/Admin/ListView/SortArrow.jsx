import React from 'react/addons';
import {merge} from '../../../merge';

export class SortArrow extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        fontSize: 9,
        marginLeft: 5,
        verticalAlign: 'middle'
      }
    };

    let arrow;
    if (this.props.direction === 'DESCENDING') {
      arrow = (
        <span style={merge(styles.container, this.props.style)}>
          &#9660;
        </span>
      );
    }
    else {
      arrow = (
        <span style={merge(styles.container, this.props.style)}>
          &#9650;
        </span>
      );
    }

    return arrow;
  }
}
