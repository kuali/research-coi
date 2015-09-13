import React from 'react/addons';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import UndoButton from '../UndoButton';
import InstructionEditor from '../InstructionEditor';
import ConfigStore from '../../../stores/ConfigStore';
import ConfigActions from '../../../actions/ConfigActions';
import QuestionnaireConfig from '../QuestionnaireConfig';

export default class Questionnaire extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.onChange = this.onChange.bind(this);
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
      questions: storeState.questions.screening,
      instructions: storeState.instructions
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

    let instructionText = '';
    if (this.state.instructions && this.state.instructions.Questionnaire) {
      instructionText = this.state.instructions.Questionnaire;
    }

    let configSection;
    if (this.state.applicationState) {
      configSection = (
        <span className="fill">
          <InstructionEditor
            step="Questionnaire"
            value={instructionText}
          />
          <QuestionnaireConfig
            questionnaireCategory="screening"
            questions={this.state.questions}
            questionsBeingEdited={this.state.applicationState.questionsBeingEdited.screening}
            newQuestion={this.state.applicationState.newQuestion.screening}
          />
        </span>
      );
    }

    return (
      <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
        <Sidebar active="questionnaire" />
        <span style={styles.content} className="inline-flexbox column fill">
          <div style={styles.stepTitle}>
            Customize Questionnaire
          </div>
          <div className="fill flexbox row" style={styles.configurationArea}>
            {configSection}
            <span style={styles.rightPanel}>
              <UndoButton onClick={this.undo} />
            </span>
          </div>
        </span>
      </span>
    );
  }
}
