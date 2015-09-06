import React from 'react/addons';
import {merge} from '../../../merge';
import Badge from './Badge';
import ConfigActions from '../../../actions/ConfigActions';
import {COIConstants} from '../../../../../COIConstants';

export default class NewQuestion extends React.Component {
  constructor() {
    super();

    this.textChanged = this.textChanged.bind(this);
    this.typeChosen = this.typeChosen.bind(this);
  }

  typeChosen() {
    let dropdown = React.findDOMNode(this.refs.typeDropdown);
    ConfigActions.questionTypeChosen(this.props.id, dropdown.value);
  }

  textChanged() {
    let textarea = React.findDOMNode(this.refs.questionText);
    ConfigActions.questionTextChanged(this.props.id, textarea.value);
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
      }
    };

    let validations;
    if (this.props.question.validations) {
      validations = this.props.question.validations.map(validation => {
        return (
          <Badge key={validation.id} style={styles.validation} id={validation.id} onDelete={this.validationRemoved}>
            {validation}
          </Badge>
        );
      });
    }

    let questionTypes = Object.keys(COIConstants.QUESTION_TYPE).map(questionType => {
      return (
        <option key={questionType} value={COIConstants.QUESTION_TYPE[questionType]}>
          {COIConstants.QUESTION_TYPE[questionType]}
        </option>
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div>
          <span style={styles.span}>
            <label style={styles.label} htmlFor="questionType">QUESTION TYPE</label>
            <div>
              <select style={styles.dropdown} value={this.props.question.type} ref="typeDropdown" onChange={this.typeChosen} id="questionType">
                <option>Select</option>
                {questionTypes}
              </select>
            </div>
          </span>
        </div>
        <div style={styles.questionTextSection}>
          <label style={styles.label}>QUESTION TEXT</label>
          <div>
            <textarea ref="questionText" value={this.props.question.text} onChange={this.textChanged} style={styles.textarea} />
          </div>
        </div>
      </div>
    );
  }
}

NewQuestion.defaultProps = {
  question: {}
};

