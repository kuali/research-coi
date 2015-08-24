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
    this.makeMainQuestion = this.makeMainQuestion.bind(this);
    this.makeSubQuestion = this.makeSubQuestion.bind(this);
    this.scheduleUpdate = this.scheduleUpdate.bind(this);
    this.drawFrame = this.drawFrame.bind(this);
    this.endDrag = this.endDrag.bind(this);
  }

  componentDidMount() {
    this.onChange();
    ConfigStore.listen(this.onChange);
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

    if (this.isASubQuestion(this.state.questions[targetIndex])) {
      // Set parent to new parent
      let newParent = this.findNewParentQuestion(this.state.questions[targetIndex]);
      if (newParent) {
        this.state.questions[targetIndex].parent = newParent.id;
      }
    }
    else {
      // Reassign potential children to this
      for (let i = targetIndex + 1; i < this.state.questions.length; i++) {
        if (this.state.questions[i].parent) {
          this.state.questions[i].parent = draggedQuestionId;
        }
        else {
          break;
        }
      }
    }

    this.scheduleUpdate({
      questions: this.state.questions
    });
  }

  isASubQuestion(question) {
    return question.parent !== undefined;
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

  moveChildrenToNewParent(currentQuestion, newParent) {
    let oldChildren = this.state.questions.filter(questionToTest => {
      return questionToTest.parent === currentQuestion.id;
    });
    oldChildren.forEach(oldChild => {
      oldChild.parent = newParent.id;
    });
  }

  makeSubQuestion(id) {
    let question = this.findQuestion(id);

    if (this.isASubQuestion(question)) {
      return;
    }

    let parent = this.findNewParentQuestion(question);
    if (parent) {
      this.moveChildrenToNewParent(question, parent);
    }

    if (parent) {
      question.parent = parent.id;
      this.scheduleUpdate({
        questions: this.state.questions
      });
    }
  }

  findNewChildren(newParentQuestion, oldParentId) {
    let newParentIndex = this.findQuestionIndex(newParentQuestion);
    let subsequentIndex = newParentIndex + 1;
    let nextQuestion = this.state.questions[subsequentIndex];
    while (subsequentIndex < this.state.questions.length && nextQuestion.parent === oldParentId) {
      nextQuestion.parent = newParentQuestion.id;
      subsequentIndex++;
      nextQuestion = this.state.questions[subsequentIndex];
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

  makeMainQuestion(id) {
    let question = this.findQuestion(id);

    if (question.parent) {
      let oldParentId = question.parent;
      delete question.parent;

      // find subsequent questions who had the old parent and move them to this question
      this.findNewChildren(question, oldParentId);

      this.scheduleUpdate({
        questions: this.state.questions
      });
    }
  }

  endDrag(id) {
    let index = this.findQuestionIndexById(id);
    if (index === 0) {
      delete this.state.questions[0].parent;

      this.scheduleUpdate({
        questions: this.state.questions
      });
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

      questions = this.state.questions.map((question) => {
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

        return (
          <Question
            appState={this.state.applicationState}
            questionMoved={this.questionMoved}
            makeMainQuestion={this.makeMainQuestion}
            makeSubQuestion={this.makeSubQuestion}
            endDrag={this.endDrag}
            number={numberToShow}
            key={question.id}
            id={question.id}
            text={question.text}
            parent={question.parent} />
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
