/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

/*eslint-disable max-len*/
import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import NewQuestion from '../new-question';
import Question from '../question';
import NewQuestionButton from '../new-question-button';
import {COIConstants} from '../../../../../coi-constants';
import PanelWithButtons from '../panel-with-buttons';
import ConfigActions from '../../../actions/config-actions';

class QuestionnaireConfig extends React.Component {
  constructor() {
    super();

    this.questionMoved = this.questionMoved.bind(this);
    this.subQuestionMoved = this.subQuestionMoved.bind(this);
    this.makeMainQuestion = this.makeMainQuestion.bind(this);
    this.makeSubQuestion = this.makeSubQuestion.bind(this);
    this.subQuestionMovedToParent = this.subQuestionMovedToParent.bind(this);
    this.newQuestionStarted = this.newQuestionStarted.bind(this);
    this.addNewQuestion = this.addNewQuestion.bind(this);
    this.newQuestionCancelled = this.newQuestionCancelled.bind(this);
  }

  subQuestionMoved(draggedQuestionId, targetId) {
    const draggedQuestion = this.findQuestion(draggedQuestionId);
    const targetQuestion = this.findQuestion(targetId);

    const parentOfDraggedQuestion = this.findParentOfSubQuestion(draggedQuestionId);
    const parentOfTargetQuestion = this.findParentOfSubQuestion(targetId);

    if (
        this.isMoving ||
        draggedQuestion === targetQuestion ||
        !parentOfDraggedQuestion ||
        !parentOfTargetQuestion
    ) {
      return;
    }

    if (parentOfDraggedQuestion === parentOfTargetQuestion) {
      const swapValue = draggedQuestion.question.order;
      draggedQuestion.question.order = targetQuestion.question.order;
      targetQuestion.question.order = swapValue;
    }
    else {
      this.subQuestionMovedToParent(draggedQuestionId, parentOfTargetQuestion.id);
    }

    this.setIsMovingFlag();

    ConfigActions.updateQuestions(this.props.questionnaireCategory, this.props.questions);
  }

  subQuestionMovedToParent(draggedQuestionId, targetId) {
    const draggedQuestion = this.findQuestion(draggedQuestionId);
    if (!draggedQuestion || this.isMoving || draggedQuestion.parent === targetId) {
      return;
    }

    const parent = this.findQuestion(targetId);
    if (parent.question.type !== COIConstants.QUESTION_TYPE.YESNO) {
      return;
    }

    draggedQuestion.parent = targetId;
    const otherSubquestions = this.findSubQuestions(targetId);

    if (otherSubquestions.length > 0) {
      draggedQuestion.question.order = 1 + otherSubquestions.reduce((previousValue, subQuestion) => {
        return Math.max(previousValue, subQuestion.question.order);
      }, 1);
    }
    else {
      draggedQuestion.question.order = 1;
    }

    this.setIsMovingFlag();

    ConfigActions.updateQuestions(this.props.questionnaireCategory, this.props.questions);
  }

  setIsMovingFlag() {
    this.isMoving = true;
    setTimeout(() => {
      delete this.isMoving;
    }, 200);
  }

  questionMoved(draggedQuestionId, targetId) {
    const draggedQuestion = this.findQuestion(draggedQuestionId);
    const targetQuestion = this.findQuestion(targetId);

    if (this.isMoving || draggedQuestion === targetQuestion || targetQuestion.parent) {
      return;
    }
    this.setIsMovingFlag();

    const swapValue = draggedQuestion.question.order;
    draggedQuestion.question.order = targetQuestion.question.order;
    targetQuestion.question.order = swapValue;

    ConfigActions.updateQuestions(this.props.questionnaireCategory, this.props.questions);
  }

  findNewParentQuestion(question) {
    return this.props.questions.find(toTest => {
      return !toTest.parent && toTest.question.order === question.question.order - 1;
    });
  }

  makeSubQuestion(id) {
    const question = this.findQuestion(id);
    if (!question || question.parent) {
      return;
    }

    const subQuestions = this.findSubQuestions(id);
    if (subQuestions.length > 0) {
      return;
    }

    // Find closest previous main question
    const parent = this.findNewParentQuestion(question);
    if (parent) {
      // Can only be a sub question if the parent is a yes/no question
      if (parent.question.type !== COIConstants.QUESTION_TYPE.YESNO) {
        return;
      }

      this.props.questions.filter(toTest => {
        return !toTest.parent && toTest.question.order > question.question.order;
      }).forEach(toBumpUp => {
        toBumpUp.question.order -= 1;
      });

      // set new order value on the question
      const otherSubquestions = this.findSubQuestions(parent.id);
      if (otherSubquestions.length > 0) {
        question.question.order = 1 + otherSubquestions.reduce((previousValue, subQuestion) => {
          return Math.max(previousValue, subQuestion.question.order);
        }, 1);
      } else {
        question.question.order = 1;
      }

      question.parent = parent.id;
      question.question.displayCriteria = 'Yes';

      ConfigActions.updateQuestions(this.props.questionnaireCategory, this.props.questions);
    }
  }

  findQuestion(id) {
    return this.props.questions.find(questionToTest => {
      return questionToTest.id === id;
    });
  }

  findParentOfSubQuestion(subQuestionId) {
    const question = this.findQuestion(subQuestionId);
    if (question.parent) {
      return this.findQuestion(question.parent);
    }
  }

  makeMainQuestion(subQuestionId) {
    const question = this.findQuestion(subQuestionId);
    const parent = this.findQuestion(question.parent);
    if (question && parent) {
      question.parent = null;

      this.props.questions.filter(toTest => {
        return !toTest.parent && toTest.question.order > parent.question.order;
      }).forEach(toBump => {
        toBump.question.order += 1;
      });

      question.question.order = parent.question.order + 1;

      ConfigActions.updateQuestions(this.props.questionnaireCategory, this.props.questions);
    }
  }

  findQuestionHeight(question) {
    const heightOfAQuestion = 139;
    const heightOfExpandedQuestion = 285;
    const heightOfExpandedMultiSelect = 390;
    let height;
    if (this.isOpen(question.id)) {
      const editState = this.props.questionsBeingEdited[question.id];
      if (editState.question.type === COIConstants.QUESTION_TYPE.MULTISELECT) {
        height = heightOfExpandedMultiSelect;
      }
      else {
        height = heightOfExpandedQuestion;
      }
    } else {
      height = heightOfAQuestion;
    }

    return height;
  }

  isOpen(id) {
    return this.props.questionsBeingEdited[id] !== undefined;
  }

  findSubQuestions(parentId) {
    return this.props.questions.filter(question => {
      return question.parent === parentId;
    });
  }

  canBeSubQuestion(question) {
    if (question.parent) {
      return false;
    }

    const potentialParent = this.findNewParentQuestion(question);
    if (!potentialParent || potentialParent.question.type !== COIConstants.QUESTION_TYPE.YESNO) {
      return false;
    }

    return true;
  }

  newQuestionCancelled() {
    ConfigActions.cancelNewQuestion(this.props.questionnaireCategory);
  }

  addNewQuestion() {
    ConfigActions.saveNewQuestion(this.props.questionnaireCategory);
  }

  newQuestionStarted() {
    ConfigActions.startNewQuestion(this.props.questionnaireCategory);
  }

  render() {
    const newQuestionButtons = [
      {
        label: '+ Add',
        onClick: this.addNewQuestion
      },
      {
        label: 'Cancel',
        onClick: this.newQuestionCancelled
      }
    ];

    let newQuestion;
    let newQuestionSection;
    let nextQuestionYPosition = 0;
    const questionsJSX = [];

    if (this.props.newQuestion) {
      newQuestion = (
        <PanelWithButtons title="Questionnaire" buttons={newQuestionButtons}>
          <NewQuestion
            question={this.props.newQuestion}
            questionnaireCategory={this.props.questionnaireCategory}
          />
        </PanelWithButtons>
      );
    }
    else {
      newQuestionSection = (
        <div className={styles.top}>
          <div className={styles.left}>
            <NewQuestionButton onClick={this.newQuestionStarted} />
          </div>
          <div className={styles.right}>
            <div className={styles.message}>
              Only parent-level, Yes/No questions can be used in screening questionnaire validations as configured in Screening Validations in General Configuration.
            </div>

          </div>
        </div>
      );
    }

    let currentQuestionNumber = 0;
    Array.from(this.props.questions).filter(question => {
      return !question.parent;
    }).sort((a, b) => {
      if (a.question.order < b.question.order) { return -1; }
      else if (a.question.order === b.question.order) { return 0; }
      return 1;
    }).forEach(question => {
      question.question.top = nextQuestionYPosition;
      nextQuestionYPosition += this.findQuestionHeight(question);
      currentQuestionNumber++;
      question.question.numberToShow = currentQuestionNumber;

      let currentSubQuestionNumber = 0;
      this.findSubQuestions(question.id).sort((a, b) => {
        return a.question.order - b.question.order;
      }).forEach(subQuestion => {
        subQuestion.question.top = nextQuestionYPosition;
        nextQuestionYPosition += this.findQuestionHeight(subQuestion);
        currentSubQuestionNumber++;
        subQuestion.question.numberToShow = `${currentQuestionNumber} - ${(String.fromCharCode(64 + currentSubQuestionNumber))}`;
      });
    });

    this.props.questions.filter(question => {
      return !question.parent;
    }).forEach((question, index) => {
      const canBeSubQuestion = index > 0 && this.canBeSubQuestion(question);

      const questionStyle = {
        cursor: canBeSubQuestion ? 'move' : 'ns-resize'
      };

      questionsJSX.push(
        <Question
          questionnaireCategory={this.props.questionnaireCategory}
          editState={this.props.questionsBeingEdited[question.id]}
          questionMoved={this.questionMoved}
          makeSubQuestion={this.props.disableSubQuestions ? () => {} : this.makeSubQuestion}
          makeMainQuestion={this.makeMainQuestion}
          subQuestionMoved={this.props.disableSubQuestions ? () => {} : this.subQuestionMoved}
          subQuestionMovedToParent={this.props.disableSubQuestions ? () => {} : this.subQuestionMovedToParent}
          number={question.question.numberToShow}
          key={question.id}
          id={question.id}
          text={question.question.text}
          isSubQuestion={false}
          top={question.question.top}
          style={questionStyle}
        />
      );

      this.findSubQuestions(question.id).forEach(subQuestion => {
        questionsJSX.push(
          <Question
            questionnaireCategory={this.props.questionnaireCategory}
            editState={this.props.questionsBeingEdited[subQuestion.id]}
            questionMoved={this.questionMoved}
            makeSubQuestion={this.props.disableSubQuestions ? () => {} : this.makeSubQuestion}
            makeMainQuestion={this.makeMainQuestion}
            subQuestionMoved={this.props.disableSubQuestions ? () => {} : this.subQuestionMoved}
            subQuestionMovedToParent={this.props.disableSubQuestions ? () => {} : this.subQuestionMovedToParent}
            number={subQuestion.question.numberToShow}
            key={subQuestion.id}
            id={subQuestion.id}
            text={subQuestion.question.text}
            isSubQuestion={true}
            top={subQuestion.question.top}
            style={{cursor: 'move'}}
            displayCriteria={subQuestion.question.displayCriteria}
          />
        );
      });
    });

    return (
      <div className={classNames(styles.container, this.props.className)}>
        {newQuestionSection}
        {newQuestion}

        <div style={{position: 'relative', marginTop: 16, minHeight: nextQuestionYPosition}}>
          {questionsJSX}
        </div>
      </div>
    );
  }
}

QuestionnaireConfig.defaultProps = {
  questions: []
};

export default DragDropContext(HTML5Backend)(QuestionnaireConfig); //eslint-disable-line new-cap
