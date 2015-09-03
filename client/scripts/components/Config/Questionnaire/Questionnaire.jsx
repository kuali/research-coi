import React from 'react/addons';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import PanelWithButtons from '../PanelWithButtons';
import UndoButton from '../UndoButton';
import InstructionEditor from '../InstructionEditor';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import NewQuestion from './NewQuestion';
import ConfigStore from '../../../stores/ConfigStore';
import ConfigActions from '../../../actions/ConfigActions';
import Question from './Question';
import NewQuestionButton from './NewQuestionButton';

class Questionnaire extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.questionMoved = this.questionMoved.bind(this);
    this.subQuestionMoved = this.subQuestionMoved.bind(this);
    this.makeMainQuestion = this.makeMainQuestion.bind(this);
    this.makeSubQuestion = this.makeSubQuestion.bind(this);
    this.scheduleUpdate = this.scheduleUpdate.bind(this);
    this.drawFrame = this.drawFrame.bind(this);
    this.subQuestionMovedToParent = this.subQuestionMovedToParent.bind(this);
  }

  componentDidMount() {
    this.onChange();
    ConfigStore.listen(this.onChange);
    ConfigActions.loadLatestQuestionnaire();
  }

  componentWillUnmount() {
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = ConfigStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      questions: storeState.questions
    });
  }

  scheduleUpdate(update) {
    this.pendingUpdate = JSON.parse(JSON.stringify(update));

    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(this.drawFrame);
    }
  }

  drawFrame() {
    this.setState(this.pendingUpdate);

    this.pendingUpdate = null;
    this.requestedFrame = null;
  }

  subQuestionMoved(draggedQuestionId, targetId) {
    let parentOfDraggedQuestion = this.findParentOfSubQuestion(draggedQuestionId);
    let parentOfTargetQuestion = this.findParentOfSubQuestion(targetId);
    if (!parentOfDraggedQuestion || !parentOfTargetQuestion) {
      return;
    }

    let currentIndex = this.findSubQuestionIndexById(parentOfDraggedQuestion.id, draggedQuestionId);
    let targetIndex = this.findSubQuestionIndexById(parentOfTargetQuestion.id, targetId);

    if (
        this.isMoving ||
        currentIndex === -1 ||
        targetIndex === -1 ||
        targetIndex >= parentOfTargetQuestion.subQuestions.length ||
        (parentOfDraggedQuestion === parentOfTargetQuestion && currentIndex === targetIndex)
       )
    {
      return;
    }

    this.setIsMovingFlag();

    if (!parentOfTargetQuestion.subQuestions) {
      parentOfTargetQuestion.subQuestions = [];
    }

    let questionRef = parentOfDraggedQuestion.subQuestions.splice(currentIndex, 1)[0];
    parentOfTargetQuestion.subQuestions.splice(targetIndex, 0, questionRef);

    this.scheduleUpdate({
      questions: this.state.questions
    });
  }

  subQuestionMovedToParent(draggedQuestionId, targetId) {
    let parentOfDraggedQuestion = this.findParentOfSubQuestion(draggedQuestionId);
    let targetQuestion = this.findQuestion(targetId);
    if (!parentOfDraggedQuestion || !targetQuestion) {
      return;
    }

    let currentIndex = this.findSubQuestionIndexById(parentOfDraggedQuestion.id, draggedQuestionId);

    if (this.isMoving || currentIndex === -1) {
      return;
    }

    this.setIsMovingFlag();

    if (!targetQuestion.subQuestions) {
      targetQuestion.subQuestions = [];
    }

    let questionRef = parentOfDraggedQuestion.subQuestions.splice(currentIndex, 1)[0];
    targetQuestion.subQuestions.push(questionRef);

    this.forceUpdate();
  }

  setIsMovingFlag() {
    this.isMoving = true;
    setTimeout(() => {
      delete this.isMoving;
    }, 200);
  }

  questionMoved(draggedQuestionId, targetId) {
    let currentIndex = this.findQuestionIndexById(draggedQuestionId);
    let targetIndex = this.findQuestionIndexById(targetId);

    if (
        this.isMoving ||
        currentIndex === targetIndex ||
        currentIndex === -1 ||
        targetIndex === -1 ||
        targetIndex >= this.state.questions.length
       )
    {
      return;
    }
    this.setIsMovingFlag();

    let questionRef = this.state.questions.splice(currentIndex, 1)[0];
    this.state.questions.splice(targetIndex, 0, questionRef);

    this.scheduleUpdate({
      questions: this.state.questions
    });
  }

  findNewParentQuestion(question) {
    let currentIndex = this.findQuestionIndex(question);
    let scanIndex = currentIndex - 1;
    while (scanIndex >= 0 && this.state.questions[scanIndex].parent) {
      scanIndex--;
    }

    if (scanIndex >= 0) {
      return this.state.questions[scanIndex];
    }
  }

  makeSubQuestion(id) {
    let question = this.findQuestion(id);
    if (!question) {
      return;
    }
    let currentIndex = this.findQuestionIndexById(id);

    // Find closest previous main question
    let parent = this.findNewParentQuestion(question);
    if (parent) {
      // Remove the question from its previous position
      let questionToMove = this.state.questions.splice(currentIndex, 1)[0];

      // Add this question to its subquestions
      if (!parent.subQuestions) { parent.subQuestions = []; }
      parent.subQuestions.push(questionToMove);

      this.scheduleUpdate({
        questions: this.state.questions
      });
    }
  }

  findQuestion(id) {
    return this.state.questions.find(questionToTest => {
      return questionToTest.id === id;
    });
  }

  findQuestionIndex(question) {
    return this.state.questions.findIndex(questionToTest => {
      return questionToTest.id === question.id;
    });
  }

  findQuestionIndexById(id) {
    return this.state.questions.findIndex(question => {
      return question.id === id;
    });
  }

  findSubQuestionIndexById(parentId, subQuestionId) {
    let parent = this.findQuestion(parentId);
    if (parent) {
      return parent.subQuestions.findIndex(subQuestion => {
        return subQuestion.id === subQuestionId;
      });
    }
  }

  findParentOfSubQuestion(subQuestionId) {
    let parentIndex = this.findParentIndexOfSubQuestion(subQuestionId);
    if (parentIndex !== -1) {
      return this.state.questions[parentIndex];
    }
  }

  findParentIndexOfSubQuestion(subQuestionId) {
    return this.state.questions.findIndex(question => {
      if (question.subQuestions) {
        let sub = question.subQuestions.find(subQuestion => {
          return subQuestion.id === subQuestionId;
        });

        return sub !== undefined;
      }
      else {
        return false;
      }
    });
  }

  makeMainQuestion(subQuestionId) {
    let parentIndex = this.findParentIndexOfSubQuestion(subQuestionId);
    if (parentIndex === -1) {
      return;
    }

    // remove from parent
    let subQuestionIndex = this.findSubQuestionIndexById(this.state.questions[parentIndex].id, subQuestionId);
    let questionToMove = this.state.questions[parentIndex].subQuestions.splice(subQuestionIndex, 1)[0];
    questionToMove.parent = null;

    // insert after parent
    this.state.questions.splice(parentIndex + 1, 0, questionToMove);

    this.scheduleUpdate({
      questions: this.state.questions
    });
  }

  newQuestionCancelled() {
    ConfigActions.cancelNewQuestion();
  }

  addNewQuestion() {
    ConfigActions.saveNewQuestion();
  }

  newQuestionStarted() {
    ConfigActions.startNewQuestion();
  }

  findQuestionHeight(question) {
    const heightOfAQuestion = 139;
    const heightOfExpandedQuestion = 285;
    let height;
    if (this.isOpen(question.id)) {
      height = heightOfExpandedQuestion;
    } else {
      height = heightOfAQuestion;
    }

    let totalSubQuestionsHeight = 0;
    if (question.subQuestions && question.subQuestions.length > 0) {
      question.subQuestions.forEach(subQuestion => {
        if (this.isOpen(subQuestion.id)) {
          totalSubQuestionsHeight += heightOfExpandedQuestion;
        } else {
          totalSubQuestionsHeight += heightOfAQuestion;
        }
      });
    }

    return height + totalSubQuestionsHeight;
  }

  isOpen(id) {
    return this.state.applicationState.questionsBeingEdited[id] !== undefined;
  }

  render() {
    let styles = {
      container: {
        overflowY: 'auto',
        minHeight: 0
      },
      content: {
        backgroundColor: '#eeeeee',
        boxShadow: '2px 8px 8px #ccc inset',
        minHeight: 0
      },
      stepTitle: {
        boxShadow: '0 2px 8px #D5D5D5',
        fontSize: 33,
        textTransform: 'uppercase',
        padding: '15px 15px 15px 35px',
        color: '#525252',
        fontWeight: 300,
        backgroundColor: 'white',
        minHeight: 68
      },
      configurationArea: {
        padding: 35,
        overflowY: 'auto',
        minHeight: 0
      },
      rightPanel: {
        padding: '0 20px'
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
    let questions;
    let newQuestionButton;
    let nextQuestionYPosition = 0;

    if (this.state.applicationState) {
      if (this.state.applicationState.newQuestion) {
        newQuestion = (
          <PanelWithButtons title="Questionnaire" buttons={newQuestionButtons}>
            <NewQuestion question={this.state.applicationState.newQuestion} />
          </PanelWithButtons>
        );
      }
      else {
        newQuestionButton = (
          <NewQuestionButton onClick={this.newQuestionStarted} />
        );
      }

      let currentQuestionNumber = 0;
      this.state.questions.forEach(question => {
        question.top = nextQuestionYPosition;
        nextQuestionYPosition += this.findQuestionHeight(question);

        currentQuestionNumber++;
        question.numberToShow = currentQuestionNumber;
      });

      questions = Array.from(this.state.questions);
      questions = questions.sort((a, b) => {
        if (a.id < b.id) { return -1; }
        else if (a.id === b.id) { return 0; }
        else { return 1; }
      }).map((question, index) => {
        let canBeSubQuestion = index > 0 && (!question.subQuestions || question.subQuestions.length === 0);

        let questionStyle = {
          cursor: canBeSubQuestion ? 'move' : 'ns-resize'
        };

        return (
          <Question
            appState={this.state.applicationState}
            questionMoved={this.questionMoved}
            makeMainQuestion={this.makeMainQuestion}
            makeSubQuestion={this.makeSubQuestion}
            subQuestionMoved={this.subQuestionMoved}
            subQuestionMovedToParent={this.subQuestionMovedToParent}
            number={question.numberToShow}
            key={question.id}
            id={question.id}
            text={question.text}
            subQuestions={question.subQuestions}
            top={question.top}
            style={questionStyle} />
        );
      });
    }

    return (
      <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
        <Sidebar active="questionnaire" />
        <span style={styles.content} className="inline-flexbox column fill">
          <div style={styles.stepTitle}>
            Customize Questionnaire
          </div>
          <div className="fill flexbox row" style={styles.configurationArea}>
            <span className="fill">
              <InstructionEditor step="Questionnaire" />
              {newQuestionButton}
              {newQuestion}

              <div style={{position: 'relative', marginTop: 16, minHeight: nextQuestionYPosition}}>
                {questions}
              </div>
            </span>
            <span style={styles.rightPanel}>
              <UndoButton onClick={this.undo} />
            </span>
          </div>
        </span>
      </span>
    );
  }
}

export default DragDropContext(HTML5Backend)(Questionnaire); //eslint-disable-line new-cap
