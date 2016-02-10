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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {GreyButton} from '../../grey-button';
import {BlueButton} from '../../blue-button';
import Gripper from '../../dynamic-icons/gripper';
import {DragSource, DropTarget} from 'react-dnd';
import NewQuestion from '../new-question';
import ConfigActions from '../../../actions/config-actions';

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
    let buttons;
    let questionDetails;

    let displayCondition;
    if (this.props.isSubQuestion) {
      displayCondition = (
        <span>
          Display if parent is
          <select ref="displayCriteria" className={styles.dropdown} value={this.props.displayCriteria} onChange={this.criteriaChanged}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </span>
      );
    }

    if (this.props.editState) {
      questionDetails = (
        <div className={`flexbox row ${styles.top}`}>
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
          <div className={styles.warning}>Only Yes/No can have subquestions. All subquestions will be deleted.</div>
        );
      }

      buttons = (
        <div className={`flexbox row`}>
          <div className={`fill`}>
            {subQuestionWarning}
          </div>
          <span>
            <GreyButton className={`${styles.override} ${styles.nonFloatButton}`} onClick={this.cancel}>Cancel</GreyButton>
            <BlueButton className={`${styles.override} ${styles.nonFloatButton}`} onClick={this.save}>Save</BlueButton>
          </span>
        </div>
      );
    }
    else {
      questionDetails = (
        <div className={`flexbox row ${styles.top}`}>
          <span className={styles.number}>{this.props.number}</span>
          <span className={`fill ${styles.text}`}>{this.props.text}</span>
        </div>
      );

      buttons = (
        <div>
          <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.edit}>Edit</GreyButton>
          <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.deleteQuestion}>Delete</GreyButton>
          {displayCondition}
        </div>
      );
    }

    const classes = classNames(
      styles.container,
      this.props.className,
      'flexbox',
      'row',
      {[styles.dragging]: this.props.isDragging},
      {[styles.subQuestion]: this.props.isSubQuestion}
    );

    return this.props.connectDragSource(
      this.props.connectDropTarget(
        <div style={{position: 'absolute', width: '100%', top: this.props.top, transition: 'all .2s ease-in-out'}}>
          <div className={classes}>
            <span className={styles.gripper}>
              <Gripper className={`${styles.override} ${styles.gripperIcon}`} color="rgba(0, 0, 0, .4)" />
            </span>
            <span className={`fill ${styles.content}`}>
              {questionDetails}

              <div className={styles.bottom}>
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
