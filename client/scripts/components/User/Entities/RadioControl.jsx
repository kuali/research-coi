import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class RadioControl extends React.Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
  }

  answer(evt) {
    this.props.onChange(evt, this.props.questionId, this.props.isParent);
  }

  render() {
    let styles = {
      option: {
        display: 'inline-block',
        marginRight: 30,
        width: '100%'
      },
      label: {
        cursor: 'pointer'
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

    let options = this.props.options.map(option=> {
      return (
      <span style={styles.option}>
        <div>
          <label htmlFor={'multi_' + option} style={styles.label}>
            <input
            key={option}
            id={'multi_' + option}
            value={option}
            checked={this.props.answer === option}
            onChange={this.answer}
            type="radio"
            />
            {option}
          </label>
        </div>
      </span>
      );
    });

    if (this.props.readonly) {
      return (
        <div style={styles.value}>
          {this.props.answer}
        </div>
      );
    }

    return (
    <div style={styles.container}>
      {options}
      {requiredFieldError}
    </div>

    );
  }
}
