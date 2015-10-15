import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class CheckboxControl extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(evt.target.value, evt.target.checked, this.props.questionId);
  }

  render() {
    let styles = {
      option: {
        display: 'inline-block',
        marginRight: 30
      },
      radio: {
        width: 22
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

    let options = this.props.options.map((option, index) => {
      let checked = {};
      if (this.props.answer instanceof Array) {
        checked = this.props.answer.includes(option);
      } else {
        checked = false;
      }

      return (
        <span style={styles.option} key={this.props.questionId + '_' + index}>
          <span>
            <input
              key={option}
              id={'multi_' + option}
              value={option}
              checked={checked}
              onChange={this.onChange}
              type="checkbox"
              style={styles.radio}
            />
          </span>
          <label htmlFor={'multi_' + option} style={styles.label}>{option}</label>
        </span>
      );
    });


    if (this.props.readonly) {
      return (
        <div style={styles.value}>
          {this.props.answer ? this.props.answer.join(', ') : ''}
        </div>
      );
    }

    return (
      <div>
        {options}
        {requiredFieldError}
      </div>
    );
  }
}
