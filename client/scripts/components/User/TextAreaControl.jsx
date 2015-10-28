import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class TextAreaControl extends React.Component {
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
    return answer !== undefined && answer.length > 0;
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.questionId);
  }

  render() {
    let styles = {
      textarea: {
        width: '100%',
        height: 160,
        padding: 10,
        fontSize: 16,
        marginTop: 2,
        borderRadius: 5,
        border: '1px solid #AAA',
        resize: 'none'
      }
    };

    return (
      <div>
        <textarea id={`qn${this.props.questionId}`} ref="textarea" style={styles.textarea} value={this.props.answer} onChange={this.onChange} />
      </div>
    );
  }
}
