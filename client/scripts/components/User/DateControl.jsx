import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {DatePicker} from '../DatePicker';

export class DateControl extends React.Component {
  constructor(props) {
    super();

    let validity = this.isValid(props.answer);
    this.state = {
      valid: validity
    };
    props.onValidityChange(props.questionId, validity);

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let validity = this.isValid(nextProps.answer);
    if (validity !== this.state.valid) {
      this.setState({
        valid: validity
      });
      this.props.onValidityChange(this.props.questionId, validity);
    }
  }

  isValid(answer) {
    return answer !== undefined && !isNaN(answer);
  }

  onChange(newDate) {
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
          id={`qn${this.props.questionId}`}
          style={styles.datepicker}
          onChange={this.onChange}
          value={this.props.answer}
          direction={this.props.direction}
        />
      </div>
    );
  }
}
