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

export class RadioControl extends React.Component {
  constructor(props) {
    super();

    const validity = this.isValid(props.answer);
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
    const validity = this.isValid(nextProps.answer);
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
    const options = this.props.options.map((option, index) => {
      return (
        <span className={styles.option} key={`${this.props.questionId}_${index}`}>
          <div>
            <input
              id={`multi_${option}_${this.props.questionId}`}
              value={option}
              checked={this.props.answer === option}
              onChange={this.onChange}
              type="radio"
              className={styles.radio}
              name={`radioControl:${this.props.questionId}`}
            />
            <label htmlFor={`multi_${option}_${this.props.questionId}`} className={styles.label}>{option}</label>
          </div>
        </span>
      );
    });

    return (
      <div id={`qn${this.props.questionId}`}>
        {options}
      </div>
    );
  }
}
