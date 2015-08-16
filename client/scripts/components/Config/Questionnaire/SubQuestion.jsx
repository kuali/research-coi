import React from 'react/addons';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import Gripper from '../../DynamicIcons/Gripper';
import {DragSource} from 'react-dnd';
import ConfigActions from '../../../actions/ConfigActions';
import NewQuestion from './NewQuestion';

let questionSource = {
  beginDrag(props, monitor, component) { // eslint-disable-line no-unused-vars
    return {};
  },
  isDragging() {
  },
  endDrag(props, monitor, component) {
    if (monitor.didDrop()) {
      ConfigActions.questionMovedTo(component.props.id, monitor.getDropResult().position);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    offset: monitor.getDifferenceFromInitialOffset()
  };
}

export default class SubQuestion extends React.Component {
  constructor() {
    super();

    this.makeMainQuestion = this.makeMainQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  deleteQuestion() {
    ConfigActions.deleteQuestion(this.props.id);
  }

  save() {
    ConfigActions.saveQuestionEdit(this.props.id);
  }

  edit() {
    ConfigActions.startEditingQuestion(this.props.id);
  }

  cancel() {
    ConfigActions.cancelQuestionEdit(this.props.id);
  }

  makeMainQuestion() {
    ConfigActions.makeMainQuestion(this.props.id);
  }

  render() {
    let styles = {
      container: {
        borderRadius: 5,
        backgroundColor: 'white',
        boxShadow: '0 0 10px #BBB',
        overflow: 'hidden',
        cursor: 'move',
        marginLeft: 60
      },
      content: {
        display: 'inline-block',
        verticalAlign: 'top',
        height: '100%'
      },
      gripper: {
        backgroundColor: '#F2AA41',
        verticalAlign: 'top',
        display: 'inline-block',
        width: 25
      },
      gripperIcon: {
        marginLeft: 5,
        width: 15,
        height: 42,
        color: '#03728C'
      },
      top: {
        padding: 10
      },
      number: {
        fontSize: 34,
        height: '100%',
        verticalAlign: 'top',
        padding: '0px 17px'
      },
      text: {
        overflow: 'hidden',
        height: '3em',
        lineHeight: '1.5em',
        marginTop: 5,
        fontSize: 12,
        verticalAlign: 'top'
      },
      bottom: {
        borderTop: '1px solid #AAA',
        padding: '10px 20px 10px 10px',
        whiteSpace: 'nowrap',
        height: 54
      },
      button: {
        float: 'right',
        marginLeft: 10
      },
      mainQuestionButton: {
        fontSize: 33,
        fontWeight: 'bold',
        borderRadius: 20,
        border: '1px solid #aaa',
        width: 32,
        height: 32,
        textAlign: 'center',
        color: '#666',
        lineHeight: '27px',
        marginTop: 6,
        cursor: 'pointer'
      },
      dropdown: {
        marginLeft: 5
      }
    };

    let buttons;
    let questionDetails;
    if (this.props.editState) {
      questionDetails = (
        <div className="flexbox row" style={styles.top}>
          <NewQuestion id={this.props.id} question={this.props.editState} />
        </div>
      );

      buttons = (
        <div>
          <KButton style={styles.button} onClick={this.save}>Save</KButton>
          <KButton style={styles.button} onClick={this.cancel}>Cancel</KButton>
        </div>
      );
    }
    else {
      questionDetails = (
        <div className="flexbox row" style={styles.top}>
          <span style={styles.number}>{this.props.number}</span>
          <span className="fill" style={styles.text}>{this.props.text}</span>
          <span title="Make this a main question" style={styles.mainQuestionButton} onClick={this.makeMainQuestion}>&lt;</span>
        </div>
      );

      buttons = (
        <div>
          <span>
            Display
            <select style={styles.dropdown}>
              <option>If</option>
              <option>Always</option>
            </select>
            <select style={merge(styles.dropdown, {marginRight: 5})}>
              <option>Parent</option>
            </select>
            is
            <select style={styles.dropdown}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </span>
          <KButton style={styles.button} onClick={this.edit}>Edit</KButton>
          <KButton style={styles.button} onClick={this.deleteQuestion}>Delete</KButton>
        </div>
      );
    }

    return this.props.connectDragSource(
      <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={styles.gripper}>
          <Gripper style={styles.gripperIcon} />
        </span>
        <span className="fill" style={styles.content}>
          {questionDetails}

          <div style={styles.bottom}>
            {buttons}
          </div>
        </span>
      </div>
    );
  }
}

export default DragSource('subQuestion', questionSource, collect)(SubQuestion); //eslint-disable-line new-cap
