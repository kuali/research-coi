import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {DatePicker} from '../../DatePicker';
import {formatDate} from '../../../formatDate';

export class DateControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(newDate) {
    this.props.onChange(newDate, this.props.questionId);
  }

  render() {
    let styles = {
      datepicker: {
        marginTop: 4
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
      },
      textbox: {
        padding: 6,
        fontSize: 12,
        borderRadius: 0,
        width: '80%',
        border: '1px solid #B0B0B0'
      },
      invalidError: {
        fontSize: 10,
        marginTop: 2
      }
    };

    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
      <div style={styles.invalidError}>Required Field</div>
      );
    }

    if (this.props.readonly) {
      return (
        <div style={styles.value}>
          {this.props.answer ? formatDate(this.props.answer) : ''}
        </div>
      );
    }

    return (
    <div>
      <DatePicker
        id={`eqa${this.props.questionId}`}
        textFieldStyle={styles.textbox}
        style={styles.datepicker}
        onChange={this.onChange}
        value={this.props.answer}
      />
      {requiredFieldError}
    </div>
    );
  }
}
