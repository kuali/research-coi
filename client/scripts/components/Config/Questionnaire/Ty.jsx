import React from 'react/addons';
import {merge} from '../../../merge';
import {DragSource} from 'react-dnd';

let tySource = {
  beginDrag(props, monitor, component) {
    return {};
  },
  endDrag() {
  },
  isDragging() {
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Ty extends React.Component {
  render() {
    let styles = {
      container: {
        display: 'block',
        width: 100,
        height: 100,
        backgroundColor: 'blue',
        color: 'white'
      }
    };

    return this.props.connectDragSource(
      <div style={merge(styles.container, this.props.style)}>
        Frog {this.props.isDragging ? 'Whoa!' : ''}
      </div>
    );
  }
}

export default DragSource('b', tySource, collect)(Ty); //eslint-disable-line new-cap
