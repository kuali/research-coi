import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class CheckboxControl extends React.Component {
  constructor(props) {
    super();

    let validity = this.isValid(props.answer, props.required);
    this.state = {
      valid: validity
    };
    props.onValidityChange(props.questionId, validity);

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let validity = this.isValid(nextProps.answer, nextProps.required);
    if (validity !== this.state.valid) {
      this.setState({
        valid: validity
      });
      this.props.onValidityChange(this.props.questionId, validity);
    }
  }

  isValid(answer, required) {
    if (answer !== undefined && answer instanceof Array) {
      return answer.length >= required;
    }
    else {
      return false;
    }
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
        width: 22,
        height: '4em',
        verticalAlign: 'middle'
      },
      label: {
        cursor: 'pointer',
        width: 80,
        display: 'inline-block',
        verticalAlign: 'middle',
        fontWeight: 'bold',
        paddingLeft: 5
      }
    };

    let options = this.props.options.map(option => {
      let checked = {};
      if (this.props.answer instanceof Array) {
        checked = this.props.answer.includes(option);
      } else {
        checked = false;
      }

      return (
        <span style={styles.option} key={option}>
          <div>
            <input
              id={'multi_' + option}
              value={option}
              checked={checked}
              onChange={this.onChange}
              type="checkbox"
              style={styles.radio}
            />
            <label htmlFor={'multi_' + option} style={styles.label}>{option}</label>
          </div>
        </span>
      );
    });

    return (
      <div id={'cbc' + this.props.questionId}>
        <div>
          {options}
        </div>
      </div>
    );
  }
}
