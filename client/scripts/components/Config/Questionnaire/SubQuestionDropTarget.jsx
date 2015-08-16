import React from 'react/addons';
import {merge} from '../../../merge';
import {DropTarget} from 'react-dnd';

const questionTarget = {
  drop(props) {
    return {
      position: props.position
    };
  },

  canDrop() {
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

export default class SubQuestionDropTarget extends React.Component {
  constructor() {
    super();
    this.state = {
      potential: false
    };
  }

  render() {
    let styles = {
      container: {
        height: 25,
        borderRadius: 15,
        backgroundColor: this.props.isOver ? '#FFE600' : 'transparent',
        marginLeft: 30
      }
    };

    return this.props.connectDropTarget(
      <div style={merge(styles.container, this.props.style)}>
      </div>
    );
  }
}

export default DropTarget('subQuestion', questionTarget, collect)(SubQuestionDropTarget); // eslint-disable-line new-cap
