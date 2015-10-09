import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class NumericControl extends React.Component {
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
    return answer !== undefined && answer > 0;
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, this.props.questionId);
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
          <input
            style={styles.textbox}
            type="number"
            id="number"
            onChange={this.onChange}
            value={this.props.answer}
          />
        </div>
      </div>
    );
  }
}
