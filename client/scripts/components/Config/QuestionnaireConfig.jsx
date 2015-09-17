import React from 'react/addons';
import {merge} from '../../merge';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import NewQuestion from './NewQuestion';
import Question from './Question';
import NewQuestionButton from './NewQuestionButton';
import {COIConstants} from '../../../../COIConstants';
import PanelWithButtons from './PanelWithButtons';
import ConfigActions from '../../actions/ConfigActions';

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
    let draggedQuestion = this.findQuestion(draggedQuestionId);
    let targetQuestion = this.findQuestion(targetId);

    let parentOfDraggedQuestion = this.findParentOfSubQuestion(draggedQuestionId);
    let parentOfTargetQuestion = this.findParentOfSubQuestion(targetId);

    if (
        this.isMoving ||
        draggedQuestion === targetQuestion ||
        !parentOfDraggedQuestion ||
        !parentOfTargetQuestion
    ) {
      return;
    }

    if (parentOfDraggedQuestion === parentOfTargetQuestion) {
      let swapValue = draggedQuestion.question.order;
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
    let draggedQuestion = this.findQuestion(draggedQuestionId);
    if (!draggedQuestion || this.isMoving || draggedQuestion.parent === targetId) {
      return;
    }

    let parent = this.findQuestion(targetId);
    if (parent.question.type !== COIConstants.QUESTION_TYPE.YESNO) {
      return;
    }

    draggedQuestion.parent = targetId;
    let otherSubquestions = this.findSubQuestions(targetId);

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
    let draggedQuestion = this.findQuestion(draggedQuestionId);
    let targetQuestion = this.findQuestion(targetId);

    if (this.isMoving || draggedQuestion === targetQuestion || targetQuestion.parent) {
      return;
    }
    this.setIsMovingFlag();

    let swapValue = draggedQuestion.question.order;
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
    let question = this.findQuestion(id);
    if (!question || question.parent) {
      return;
    }

    let subQuestions = this.findSubQuestions(id);
    if (subQuestions.length > 0) {
      return;
    }

    // Find closest previous main question
    let parent = this.findNewParentQuestion(question);
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
      let otherSubquestions = this.findSubQuestions(parent.id);
      if (otherSubquestions.length > 0) {
        question.question.order = 1 + otherSubquestions.reduce((previousValue, subQuestion) => {
          return Math.max(previousValue, subQuestion.question.order);
        }, 1);
      } else {
        question.question.order = 1;
      }

      question.parent = parent.id;

      ConfigActions.updateQuestions(this.props.questionnaireCategory, this.props.questions);
    }
  }

  findQuestion(id) {
    return this.props.questions.find(questionToTest => {
      return questionToTest.id === id;
    });
  }

  findParentOfSubQuestion(subQuestionId) {
    let question = this.findQuestion(subQuestionId);
    if (question.parent) {
      return this.findQuestion(question.parent);
    }
  }

  makeMainQuestion(subQuestionId) {
    let question = this.findQuestion(subQuestionId);
    let parent = this.findQuestion(question.parent);
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
      let editState = this.props.questionsBeingEdited[question.id];
      if (editState.type === COIConstants.QUESTION_TYPE.MULTISELECT) {
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

    let potentialParent = this.findNewParentQuestion(question);
    if (!potentialParent || potentialParent.question.type !== COIConstants.QUESTION_TYPE.YESNO) {
      return false;
    }
    else {
      return true;
    }
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
    let styles = {
      container: {
      }
    };

    let newQuestionButtons = [
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
    let newQuestionButton;
    let nextQuestionYPosition = 0;
    let questionsJSX = [];

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
      newQuestionButton = (
        <NewQuestionButton onClick={this.newQuestionStarted} />
      );
    }

    let currentQuestionNumber = 0;
    Array.from(this.props.questions).filter(question => {
      return !question.parent;
    }).sort((a, b) => {
      if (a.question.order < b.question.order) { return -1; }
      else if (a.question.order === b.question.order) { return 0; }
      else { return 1; }
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
        subQuestion.question.numberToShow = currentQuestionNumber + ' - ' + (String.fromCharCode(64 + currentSubQuestionNumber));
      });
    });

    this.props.questions.filter(question => {
      return !question.parent;
    }).forEach((question, index) => {
      let canBeSubQuestion = index > 0 && this.canBeSubQuestion(question);

      let questionStyle = {
        cursor: canBeSubQuestion ? 'move' : 'ns-resize'
      };

      questionsJSX.push(
        <Question
          questionnaireCategory={this.props.questionnaireCategory}
          editState={this.props.questionsBeingEdited[question.id]}
          questionMoved={this.questionMoved}
          makeSubQuestion={this.makeSubQuestion}
          makeMainQuestion={this.makeMainQuestion}
          subQuestionMoved={this.subQuestionMoved}
          subQuestionMovedToParent={this.subQuestionMovedToParent}
          number={question.question.numberToShow}
          key={question.id}
          id={question.id}
          text={question.question.text}
          isSubQuestion={false}
          top={question.question.top}
          style={questionStyle} />
      );

      this.findSubQuestions(question.id).forEach(subQuestion => {
        questionsJSX.push(
          <Question
            questionnaireCategory={this.props.questionnaireCategory}
            editState={this.props.questionsBeingEdited[subQuestion.id]}
            questionMoved={this.questionMoved}
            makeSubQuestion={this.makeSubQuestion}
            makeMainQuestion={this.makeMainQuestion}
            subQuestionMoved={this.subQuestionMoved}
            subQuestionMovedToParent={this.subQuestionMovedToParent}
            number={subQuestion.question.numberToShow}
            key={subQuestion.id}
            id={subQuestion.id}
            text={subQuestion.question.text}
            isSubQuestion={true}
            top={subQuestion.question.top}
            style={{cursor: 'move'}}
            displayCriteria={subQuestion.question.displayCriteria} />
        );
      });
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
          {newQuestionButton}
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
