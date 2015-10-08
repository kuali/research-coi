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
              onChange={this.answer}
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
