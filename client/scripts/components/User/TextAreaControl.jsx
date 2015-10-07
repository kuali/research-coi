import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class TextAreaControl extends React.Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
  }

  answer(evt) {
    this.props.onChange(evt, this.props.questionId);
  }

  render() {
    let styles = {
      textarea: {
        width: '100%',
        height: 160,
        padding: 10,
        fontSize: 16,
        margin: '2px 0 30px 0',
        borderRadius: 5,
        border: '1px solid #AAA'
      }
    };

    return (
      <div>
        <textarea id="textarea" ref="textarea" style={styles.textarea} value={this.props.answer} onChange={this.answer} />
      </div>
    );
  }
}
