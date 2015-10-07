import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {DatePicker} from '../DatePicker';

export class DateControl extends React.Component {
  constructor() {
    super();

    this.answerDate = this.answerDate.bind(this);
  }

  answerDate(newDate) {
    this.props.onChange(newDate, this.props.questionId);
  }

  render() {
    let styles = {
      datepicker: {
        marginTop: 4
      }
    };

    return (
      <div>
        <DatePicker
          id="questionDate"
          style={styles.datepicker}
          onChange={this.answerDate}
          value={this.props.answer}
          direction="Up"
        />
      </div>
    );
  }
}
