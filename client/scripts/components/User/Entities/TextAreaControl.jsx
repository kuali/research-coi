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
        border: '1px solid #C7C7C7',
        fontSize: 16,
        padding: 5,
        borderBottom: this.props.invalid ? '3px solid red' : '1px solid #aaa'
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
        <textarea id="textarea" ref="textarea" style={styles.textarea} value={this.props.answer} onChange={this.onChange} />
        {requiredFieldError}
      </div>
    );
  }
}
