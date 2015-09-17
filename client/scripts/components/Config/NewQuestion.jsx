import React from 'react/addons';
import {merge} from '../../merge';
import Badge from './Badge';
import ConfigActions from '../../actions/ConfigActions';
import {COIConstants} from '../../../../COIConstants';

export default class NewQuestion extends React.Component {
  constructor() {
    super();

    this.textChanged = this.textChanged.bind(this);
    this.typeChosen = this.typeChosen.bind(this);
    this.optionTextChanged = this.optionTextChanged.bind(this);
    this.optionDeleted = this.optionDeleted.bind(this);
    this.requiredSelectionsChanged = this.requiredSelectionsChanged.bind(this);
  }

  typeChosen() {
    let dropdown = React.findDOMNode(this.refs.typeDropdown);
    ConfigActions.questionTypeChosen(this.props.questionnaireCategory, this.props.id, dropdown.value);
  }

  textChanged() {
    let textarea = React.findDOMNode(this.refs.questionText);
    ConfigActions.questionTextChanged(this.props.questionnaireCategory, this.props.id, textarea.value);
  }

  optionTextChanged(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      let textbox = React.findDOMNode(this.refs.optionText);
      ConfigActions.multiSelectOptionAdded(this.props.questionnaireCategory, this.props.id, textbox.value);
      textbox.value = '';
    }
  }

  optionDeleted(optionId) {
    ConfigActions.multiSelectOptionDeleted(this.props.questionnaireCategory, this.props.id, optionId);
  }

  requiredSelectionsChanged() {
    let textbox = React.findDOMNode(this.refs.requiredNumSelections);
    ConfigActions.requiredNumSelectionsChanged(this.props.questionnaireCategory, this.props.id, textbox.value);
  }

  render() {
    let styles = {
      container: {
        width: '100%'
      },
      span: {
        display: 'inline-block',
        padding: 10
      },
      dropdown: {
        padding: 10,
        border: '1px solid #AAA',
        width: 150,
        fontSize: 17,
        height: 28
      },
      label: {
        fontSize: 13,
        paddingBottom: 4,
        display: 'inline-block'
      },
      questionTextSection: {
        padding: 10
      },
      textarea: {
        borderRadius: 5,
        height: 70,
        width: '100%',
        border: '1px solid #aaa',
        resize: 'none',
        padding: 10,
        fontSize: 16
      },
      button: {
        float: 'right'
      },
      footer: {
        borderTop: '1px solid green'
      },
      validation: {
        marginRight: 5
      },
      textbox: {
        padding: 6,
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #B0B0B0'
      },
      tip: {
        fontSize: 12,
        color: '#666',
        paddingTop: 5,
        paddingBottom: 15
      },
      optionEnteringSection: {
        display: 'inline-block',
        verticalAlign: 'top'
      },
      options: {
        display: 'inline-block',
        verticalAlign: 'top',
        padding: '24px 20px 0 20px',
        overflowY: 'auto',
        height: 95
      },
      option: {
        margin: '0 5px 5px 0',
        display: 'inline-block',
        backgroundColor: '#2A9788',
        fontSize: 16
      },
      requiredSelectionsSection: {
        display: 'inline-block',
        marginLeft: 59
      }
    };

    let questionTypes = Object.keys(COIConstants.QUESTION_TYPE).map(questionType => {
      return (
        <option key={questionType} value={COIConstants.QUESTION_TYPE[questionType]}>
          {COIConstants.QUESTION_TYPE[questionType]}
        </option>
      );
    });

    let multiSelectOptions, requiredSelections;
    if (this.props.question.question.type === COIConstants.QUESTION_TYPE.MULTISELECT) {
      let options;
      if (this.props.question.question.options) {
        options = this.props.question.question.options.map(option => {
          return (
            <Badge key={option} style={styles.option} id={option} onDelete={this.optionDeleted}>{option}</Badge>
          );
        });
      }

      multiSelectOptions = (
        <div className="flexbox row" style={{padding: '10px 10px 0 10px'}}>
          <span style={styles.optionEnteringSection}>
            <div>
              <label style={styles.label} htmlFor="options">OPTIONS</label>
            </div>
            <div>
              <input style={styles.textbox} ref="optionText" type="text" id="options" onKeyUp={this.optionTextChanged} />
            </div>
            <div style={styles.tip}>
              (Push Enter to add another)
            </div>
          </span>
          <span className="fill" style={styles.options}>
            {options}
          </span>
        </div>
      );

      requiredSelections = (
        <span style={styles.requiredSelectionsSection}>
          <label style={styles.label} htmlFor="requiredNumSelections">SELECTIONS REQUIRED</label>
          <div>
            <input style={styles.textbox} type="number" id="requiredNumSelections" ref="requiredNumSelections" onChange={this.requiredSelectionsChanged} value={this.props.question.question.requiredNumSelections} />
          </div>
        </span>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div>
          <span style={styles.span}>
            <label style={styles.label} htmlFor="questionType">QUESTION TYPE</label>
            <div>
              <select style={styles.dropdown} value={this.props.question.question.type} ref="typeDropdown" onChange={this.typeChosen} id="questionType">
                <option>Select</option>
                {questionTypes}
              </select>
            </div>
          </span>
          {requiredSelections}
        </div>
        {multiSelectOptions}
        <div style={styles.questionTextSection}>
          <label style={styles.label}>QUESTION TEXT</label>
          <div>
            <textarea ref="questionText" value={this.props.question.question.text} onChange={this.textChanged} style={styles.textarea} />
          </div>
        </div>
      </div>
    );
  }
}

NewQuestion.defaultProps = {
  question: {}
};

