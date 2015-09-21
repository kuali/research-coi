import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {NextButton} from './NextButton';

export class NumericControl extends React.Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
    this.submit = this.submit.bind(this);
  }

  answer(evt) {
    this.props.onChange(evt, this.props.questionId);
  }

  submit() {
    this.props.onClick(this.props.answer, this.props.questionId);
  }

  render() {
    let styles = {
      container: {
        width: '100%',
        display: 'inline-block'
      },
      textbox: {
        padding: 6,
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #B0B0B0'
      }
    };

    let nextButton = this.props.isParent ? <NextButton onClick={this.submit} isValid={this.props.isValid}/> : {};

    return (
      <div>
        <div style={styles.container}>
          <input style={styles.textbox} type="number" id="number" onChange={this.answer} value={this.props.answer} />
        </div>
        {nextButton}
        <div style={{clear: 'both'}}/>
      </div>
    );
  }
}
