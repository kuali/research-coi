import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {NextButton} from './NextButton';
import {DatePicker} from '../../DatePicker';

export class DateControl extends React.Component {
  constructor() {
    super();

    this.answerDate = this.answerDate.bind(this);
    this.submit = this.submit.bind(this);
  }

  answerDate(newDate) {
    this.props.onChange(newDate);
  }

  submit() {
    if (this.props.isValid){
      this.props.onClick();
    }
  }

  render() {
    let styles = {
      datepicker: {
        marginTop: 4
      }
    };

    return (
      <div>
        <DatePicker id="questionDate" style={styles.datepicker} onChange={this.answerDate} value={this.props.answer} />
        <NextButton onClick={this.submit} isValid={this.props.isValid}/>
        <div style={{clear: 'both'}}/>
      </div>
    );
  }
}
