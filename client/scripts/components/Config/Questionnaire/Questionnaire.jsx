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
      let swapValue = draggedQuestion.order;
      draggedQuestion.order = targetQuestion.order;
      targetQuestion.order = swapValue;
    }
    else {
      this.subQuestionMovedToParent(draggedQuestionId, parentOfTargetQuestion.id);
    }

    this.setIsMovingFlag();

    ConfigActions.updateQuestions(this.state.questions);
  }

  subQuestionMovedToParent(draggedQuestionId, targetId) {
    let draggedQuestion = this.findQuestion(draggedQuestionId);
    if (!draggedQuestion || this.isMoving || draggedQuestion.parent === targetId) {
      return;
    }

    draggedQuestion.parent = targetId;
    let otherSubquestions = this.findSubQuestions(targetId);

    if (otherSubquestions.length > 0) {
      draggedQuestion.order = 1 + otherSubquestions.reduce((previousValue, subQuestion) => {
        return Math.max(previousValue, subQuestion.order);
      }, 1);
    }
    else {
      draggedQuestion.order = 1;
    }

    this.setIsMovingFlag();

    ConfigActions.updateQuestions(this.state.questions);
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

    let swapValue = draggedQuestion.order;
    draggedQuestion.order = targetQuestion.order;
    targetQuestion.order = swapValue;

    ConfigActions.updateQuestions(this.state.questions);
  }

  findNewParentQuestion(question) {
    return this.state.questions.find(toTest => {
      return !toTest.parent && toTest.order === question.order - 1;
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
      this.state.questions.filter(toTest => {
        return !toTest.parent && toTest.order > question.order;
      }).forEach(toBumpUp => {
        toBumpUp.order -= 1;
      });

      // set new order value on the question
      let otherSubquestions = this.findSubQuestions(parent.id);
      if (otherSubquestions.length > 0) {
        question.order = 1 + otherSubquestions.reduce((previousValue, subQuestion) => {
          return Math.max(previousValue, subQuestion.order);
        }, 1);
      } else {
        question.order = 1;
      }

      question.parent = parent.id;

      ConfigActions.updateQuestions(this.state.questions);
    }
  }

  findQuestion(id) {
    return this.state.questions.find(questionToTest => {
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

      this.state.questions.filter(toTest => {
        return !toTest.parent && toTest.order > parent.order;
      }).forEach(toBump => {
        toBump.order += 1;
      });

      question.order = parent.order + 1;

      ConfigActions.updateQuestions(this.state.questions);
    }
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

    return height;
  }

  isOpen(id) {
    return this.state.applicationState.questionsBeingEdited[id] !== undefined;
  }

  findSubQuestions(parentId) {
    return this.state.questions.filter(question => {
      return question.parent === parentId;
    });
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
    let newQuestionButton;
    let nextQuestionYPosition = 0;
    let questionsJSX = [];

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
      Array.from(this.state.questions).filter(question => {
        return !question.parent;
      }).sort((a, b) => {
        if (a.order < b.order) { return -1; }
        else if (a.order === b.order) { return 0; }
        else { return 1; }
      }).forEach(question => {
        question.top = nextQuestionYPosition;
        nextQuestionYPosition += this.findQuestionHeight(question);
        currentQuestionNumber++;
        question.numberToShow = currentQuestionNumber;

        let currentSubQuestionNumber = 0;
        this.findSubQuestions(question.id).sort((a, b) => {
          return a.order - b.order;
        }).forEach(subQuestion => {
          subQuestion.top = nextQuestionYPosition;
          nextQuestionYPosition += this.findQuestionHeight(subQuestion);
          currentSubQuestionNumber++;
          subQuestion.numberToShow = currentQuestionNumber + ' - ' + (String.fromCharCode(64 + currentSubQuestionNumber));
        });
      });

      this.state.questions.filter(question => {
        return !question.parent;
      }).forEach((question, index) => {
        let canBeSubQuestion = index > 0 && (!question.subQuestions || question.subQuestions.length === 0);

        let questionStyle = {
          cursor: canBeSubQuestion ? 'move' : 'ns-resize'
        };

        questionsJSX.push(
          <Question
            order={question.order}
            appState={this.state.applicationState}
            questionMoved={this.questionMoved}
            makeSubQuestion={this.makeSubQuestion}
            makeMainQuestion={this.makeMainQuestion}
            subQuestionMoved={this.subQuestionMoved}
            subQuestionMovedToParent={this.subQuestionMovedToParent}
            number={question.numberToShow}
            key={question.id}
            id={question.id}
            text={question.text}
            isSubQuestion={false}
            top={question.top}
            style={questionStyle} />
        );

        this.findSubQuestions(question.id).forEach(subQuestion => {
          questionsJSX.push(
            <Question
              order={question.order}
              appState={this.state.applicationState}
              questionMoved={this.questionMoved}
              makeSubQuestion={this.makeSubQuestion}
              makeMainQuestion={this.makeMainQuestion}
              subQuestionMoved={this.subQuestionMoved}
              subQuestionMovedToParent={this.subQuestionMovedToParent}
              number={subQuestion.numberToShow}
              key={subQuestion.id}
              id={subQuestion.id}
              text={subQuestion.text}
              isSubQuestion={true}
              top={subQuestion.top}
              style={{cursor: 'move'}} />
          );
        });
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
                {questionsJSX}
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
