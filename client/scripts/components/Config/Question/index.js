/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import React from 'react';
import {merge} from '../../merge';
import {GreyButton} from '../GreyButton';
import {BlueButton} from '../BlueButton';
import Gripper from '../DynamicIcons/Gripper';
import {DragSource, DropTarget} from 'react-dnd';
import NewQuestion from './NewQuestion';
import ConfigActions from '../../actions/ConfigActions';

const questionTarget = {
  hover(props, monitor) {
    const itemBeingDragged = monitor.getItem();
    const draggedId = itemBeingDragged.id;
    const xOffset = monitor.getDifferenceFromInitialOffset().x;

    if (itemBeingDragged.isSubQuestion && xOffset < -50) {
      props.makeMainQuestion(draggedId);
    }
    else if (!itemBeingDragged.isSubQuestion && xOffset > 50) {
      props.makeSubQuestion(draggedId);
    }

    if (draggedId !== props.id) {
      if (itemBeingDragged.isSubQuestion) {
        if (props.isSubQuestion) {
          props.subQuestionMoved(draggedId, props.id);
        }
        else {
          props.subQuestionMovedToParent(draggedId, props.id);
        }
      }
      else {
        props.questionMoved(draggedId, props.id);
      }
    }
  }
};

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

const questionSource = {
  beginDrag(props, monitor, component) { // eslint-disable-line no-unused-vars
    return props;
  },
  isDragging() {
    return false;
  },
  endDrag(props, monitor, component) { // eslint-disable-line no-unused-vars
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Question extends React.Component {
  constructor() {
    super();

    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.criteriaChanged = this.criteriaChanged.bind(this);
  }

  deleteQuestion() {
    ConfigActions.deleteQuestion(this.props.questionnaireCategory, this.props.id);
  }

  save() {
    ConfigActions.saveQuestionEdit(this.props.questionnaireCategory, this.props.id);
  }

  edit() {
    ConfigActions.startEditingQuestion(this.props.questionnaireCategory, this.props.id);
  }

  cancel() {
    ConfigActions.cancelQuestionEdit(this.props.questionnaireCategory, this.props.id);
  }

  criteriaChanged() {
    const dropdown = this.refs.displayCriteria;
    ConfigActions.criteriaChanged(this.props.questionnaireCategory, this.props.id, dropdown.value);
  }

  render() {
    const styles = {
      container: {
        borderRadius: 5,
        backgroundColor: 'white',
        boxShadow: '0 0 10px #BBB',
        overflow: 'hidden',
        visibility: this.props.isDragging ? 'hidden' : 'visible',
        marginLeft: this.props.isSubQuestion ? 100 : 0,
        transition: 'all .2s ease-in-out'
      },
      content: {
        display: 'inline-block',
        verticalAlign: 'top',
        height: '100%'
      },
      gripper: {
        backgroundColor: window.colorBlindModeOn ? '#666' : this.props.isSubQuestion ? '#F57C00' : '#0095A0',
        verticalAlign: 'top',
        display: 'inline-block',
        width: 25
      },
      gripperIcon: {
        marginLeft: 5,
        width: 15,
        height: 42,
        color: 'rgba(0, 0, 0, .4)'
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
        verticalAlign: 'top',
        display: 'inline-block'
      },
      bottom: {
        borderTop: '1px solid #AAA',
        padding: '10px 20px 10px 10px',
        whiteSpace: 'nowrap',
        height: 54
      },
      button: {
        float: 'right',
        margin: '4px 0 3px 10px',
        height: 27,
        width: 124
      },
      nonFloatButton: {
        margin: '4px 0 3px 10px',
        height: 27,
        width: 124
      },
      dropdown: {
        marginLeft: 5
      },
      extraSpace: {
        position: 'absolute',
        width: '100%',
        top: this.props.top,
        transition: 'all .2s ease-in-out'
      },
      warning: {
        color: window.colorBlindModeOn ? 'black' : 'red',
        fontSize: 14,
        whiteSpace: 'normal',
        paddingLeft: 10
      }
    };

    let buttons;
    let questionDetails;

    let displayCondition;
    if (this.props.isSubQuestion) {
      displayCondition = (
        <span>
          Display if parent is
          <select ref="displayCriteria" style={styles.dropdown} value={this.props.displayCriteria} onChange={this.criteriaChanged}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </span>
      );
    }

    if (this.props.editState) {
      questionDetails = (
        <div className="flexbox row" style={styles.top}>
          <NewQuestion
            id={this.props.id}
            question={this.props.editState}
            questionnaireCategory={this.props.questionnaireCategory}
          />
        </div>
      );

      let subQuestionWarning;
      if (this.props.editState.showWarning) {
        subQuestionWarning = (
          <div style={styles.warning}>Only Yes/No can have subquestions. All subquestions will be deleted.</div>
        );
      }

      buttons = (
        <div className="flexbox row">
          <div className="fill">
            {subQuestionWarning}
          </div>
          <span>
            <GreyButton style={styles.nonFloatButton} onClick={this.cancel}>Cancel</GreyButton>
            <BlueButton style={styles.nonFloatButton} onClick={this.save}>Save</BlueButton>
          </span>
        </div>
      );
    }
    else {
      questionDetails = (
        <div className="flexbox row" style={styles.top}>
          <span style={styles.number}>{this.props.number}</span>
          <span className="fill" style={styles.text}>{this.props.text}</span>
        </div>
      );

      buttons = (
        <div>
          <GreyButton style={styles.button} onClick={this.edit}>Edit</GreyButton>
          <GreyButton style={styles.button} onClick={this.deleteQuestion}>Delete</GreyButton>
          {displayCondition}
        </div>
      );
    }

    return this.props.connectDragSource(
      this.props.connectDropTarget(
        <div style={styles.extraSpace}>
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
        </div>
      )
    );
  }
}

let questionComponent = DragSource('question', questionSource, collectSource)(Question); //eslint-disable-line new-cap
questionComponent = DropTarget('question', questionTarget, collectTarget)(questionComponent); //eslint-disable-line new-cap
export default questionComponent;
