import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class RadioControl extends React.Component {
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
    this.props.onChange(evt.target.value, this.props.questionId, this.props.isParent);
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
      return (
        <span style={styles.option} key={option}>
          <div>
            <input
              id={'multi_' + option}
              value={option}
              checked={this.props.answer === option}
              onChange={this.onChange}
              type="radio"
              style={styles.radio}
              name={'radioControl:' + this.props.questionId}
            />
            <label htmlFor={'multi_' + option} style={styles.label}>{option}</label>
          </div>
      </span>
      );
    });

    return (
      <div>
        {options}
      </div>
    );
  }
}
