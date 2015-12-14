/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import React from 'react'; //eslint-disable-line no-unused-vars

export class CheckboxControl extends React.Component {
  constructor(props) {
    super();

    let validity = this.isValid(props.answer, props.required);
    this.state = {
      valid: validity
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let validity = this.isValid(this.props.answer);
    this.props.onValidityChange(this.props.questionId, validity);
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

    return false;
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

    let options = this.props.options.map((option, index) => {
      let checked = {};
      if (this.props.answer instanceof Array) {
        checked = this.props.answer.includes(option);
      } else {
        checked = false;
      }

      return (
        <span style={styles.option} key={this.props.questionId + '_' + index}>
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
