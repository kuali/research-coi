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
    this.pendingUpdate = update;

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
    let parentQuestion = this.findParentOfSubQuestion(draggedQuestionId);
    if (!parentQuestion) {
      return;
    }

    let currentIndex = this.findSubQuestionIndexById(parentQuestion.id, draggedQuestionId);
    let targetIndex = this.findSubQuestionIndexById(parentQuestion.id, targetId);

    if (
        currentIndex === targetIndex ||
        currentIndex === -1 ||
        targetIndex === -1 ||
        targetIndex >= this.state.questions.length
       )
    {
      return;
    }

    let questionRef = parentQuestion.subQuestions.splice(currentIndex, 1)[0];
    parentQuestion.subQuestions.splice(targetIndex, 0, questionRef);

    this.scheduleUpdate({
      questions: this.state.questions
    });
  }

  questionMoved(draggedQuestionId, targetId) {
    let currentIndex = this.findQuestionIndexById(draggedQuestionId);
    let targetIndex = this.findQuestionIndexById(targetId);

    if (
        currentIndex === targetIndex ||
        currentIndex === -1 ||
        targetIndex === -1 ||
        targetIndex >= this.state.questions.length
       )
    {
      return;
    }

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

  render() {
    let styles = {
      container: {
      },
      content: {
        backgroundColor: '#eeeeee',
        boxShadow: '2px 8px 8px #ccc inset'
      },
      stepTitle: {
        boxShadow: '0 2px 8px #D5D5D5',
        fontSize: 33,
        textTransform: 'uppercase',
        padding: '15px 15px 15px 35px',
        color: '#525252',
        fontWeight: 300,
        backgroundColor: 'white'
      },
      configurationArea: {
        padding: 35
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

      let subIndex;
      let parentIndex = 0;
      let lastParent = this.state.questions.length > 0 ? this.state.questions[0].id : 0;

      questions = this.state.questions.map((question, index) => {
        let numberToShow;
        if (question.parent && question.parent === lastParent) {
          subIndex++;
          numberToShow = parentIndex + '-' + subIndex;
        }
        else {
          lastParent = question.id;
          subIndex = 0;
          parentIndex++;
          numberToShow = parentIndex;
        }

        let canBeSubQuestion = index > 0 && (!question.subQuestions || question.subQuestions.length === 0);
        return (
          <Question
            appState={this.state.applicationState}
            questionMoved={this.questionMoved}
            makeMainQuestion={this.makeMainQuestion}
            makeSubQuestion={this.makeSubQuestion}
            subQuestionMoved={this.subQuestionMoved}
            number={numberToShow}
            key={question.id}
            id={question.id}
            text={question.text}
            parent={question.parent}
            subQuestions={question.subQuestions}
            style={canBeSubQuestion ? {cursor: 'move'} : {cursor: 'ns-resize'}} />
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

              {questions}
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
