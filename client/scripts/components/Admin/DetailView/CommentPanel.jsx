import React from 'react/addons';
import {merge} from '../../../merge';

export default class CommentPanel extends React.Component {
  render() {
    let styles = {
      container: {
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
      </div>
    );
  }
}
