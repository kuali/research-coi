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

import React from 'react/addons'; //eslint-disable-line no-unused-vars

export class TextAreaControl extends React.Component {
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
    this.props.onChange(evt.target.value, this.props.questionId);
  }

  render() {
    let styles = {
      textarea: {
        width: '100%',
        height: 160,
        padding: 10,
        fontSize: 16,
        marginTop: 2,
        borderRadius: 5,
        border: '1px solid #AAA',
        resize: 'none'
      }
    };

    return (
      <div>
        <textarea id={`qn${this.props.questionId}`} ref="textarea" style={styles.textarea} value={this.props.answer} onChange={this.onChange} />
      </div>
    );
  }
}
