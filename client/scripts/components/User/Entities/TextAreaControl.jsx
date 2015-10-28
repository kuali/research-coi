import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class TextAreaControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.questionId);
  }

  render() {
    let styles = {
      textarea: {
        width: '100%',
        height: 90,
        maxWidth: '100%',
        fontSize: 16,
        padding: 5,
        borderRadius: 5,
        border: '1px solid #AAA',
        borderBottom: this.props.invalid ? '3px solid red' : '1px solid #aaa',
        resize: 'none'
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
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
          {this.props.answer}
        </div>
      );
    }

    return (
      <div>
        <textarea id={`eqa${this.props.questionId}`} ref="textarea" style={styles.textarea} value={this.props.answer} onChange={this.onChange} />
        {requiredFieldError}
      </div>
    );
  }
}
