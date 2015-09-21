import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {NextButton} from './NextButton';

export class CheckboxControl extends React.Component {
  constructor() {
    super();

    this.answerMultiple = this.answerMultiple.bind(this);
    this.submitMultiple = this.submitMultiple.bind(this);
  }

  answerMultiple(evt) {
    this.props.onChange(evt, this.props.questionId);
  }

  submitMultiple() {
    this.props.onClick(this.props.answer, this.props.questionId);
  }

  render() {
    let styles = {
      option: {
        display: 'inline-block',
        marginRight: 30
      },
      radio: {
        width: 22,
        height: '4em'
      },
      label: {
        cursor: 'pointer'
      }
    };

    let options = this.props.options.map(option=> {
      let checked = {};
      if (this.props.answer instanceof Array) {
        checked = this.props.answer.includes(option);
      } else {
        checked = false;
      }

      return (
        <span style={styles.option}>
          <div>
            <input
            key={option}
            id={'multi_' + option}
            value={option}
            checked={checked}
            onChange={this.answerMultiple}
            type="checkbox"
            style={styles.radio}/>
          </div>
          <label htmlFor={'multi_' + option} style={styles.label}>{option}</label>
        </span>
      );
    });

    let nextButton = this.props.isParent ? <NextButton onClick={this.submitMultiple} isValid={this.props.isValid}/> : {};

    return (
      <div>
        <div>
          {options}
        </div>
        {nextButton}
        <div style={{clear: 'both'}}/>
      </div>
    );
  }
}
