import React from 'react/addons';
import {merge} from '../../../merge';
import {DropTarget} from 'react-dnd';

const coTarget = {
  drop(props, monitor, component) {
  },

  hover() {
  },

  canDrop(props) {
    return true;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class Co extends React.Component {
  render() {
    let styles = {
      container: {
        display: 'block',
        width: 200,
        height: 200,
        backgroundColor: 'green',
        marginTop: 50,
        color: 'yellow',
        fontWeight: this.props.canDrop ? 'bold' : 'normal'
      }
    };

    return this.props.connectDropTarget(
      <div style={merge(styles.container, this.props.style)}>
        Co Co
      </div>
    );
  }
}

export default DropTarget(dndtype, coTarget, collect)(Co); // eslint-disable-line new-cap
