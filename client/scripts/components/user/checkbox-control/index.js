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

import styles from './style';
import React from 'react';

export class CheckboxControl extends React.Component {
  constructor(props) {
    super();

    const validity = this.isValid(props.answer, props.required);
    this.state = {
      valid: validity
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const validity = this.isValid(this.props.answer);
    this.props.onValidityChange(this.props.questionId, validity);
  }

  componentWillReceiveProps(nextProps) {
    const validity = this.isValid(nextProps.answer, nextProps.required);
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
    const options = this.props.options.map((option, index) => {
      let checked = {};
      if (this.props.answer instanceof Array) {
        checked = this.props.answer.includes(option);
      } else {
        checked = false;
      }

      return (
        <span className={styles.option} key={`${this.props.questionId}_${index}`}>
          <div>
            <input
              id={`multi_${option}`}
              value={option}
              checked={checked}
              onChange={this.onChange}
              type="checkbox"
              className={styles.radio}
            />
            <label htmlFor={`multi_${option}`} className={styles.label}>{option}</label>
          </div>
        </span>
      );
    });

    return (
      <div id={`cbc${this.props.questionId}`}>
        <div>
          {options}
        </div>
      </div>
    );
  }
}
