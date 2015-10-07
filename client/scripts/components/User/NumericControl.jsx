import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class NumericControl extends React.Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
  }

  answer(evt) {
    this.props.onChange(evt, this.props.questionId);
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

    return (
      <div>
        <div style={styles.container}>
          <input style={styles.textbox} type="number" id="number" onChange={this.answer} value={this.props.answer} />
        </div>
      </div>
    );
  }
}
