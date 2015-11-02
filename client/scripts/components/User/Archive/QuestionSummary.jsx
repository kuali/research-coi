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

import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import {COIConstants} from '../../../../../COIConstants';

export default class extends React.Component {
  render() {
    let styles = {
      container: {
        marginBottom: 10
      },
      highlighted: {
        borderLeft: window.colorBlindModeOn ? '10px solid black' : '10px solid #F57C00',
        marginLeft: -20,
        paddingLeft: 10
      },
      number: {
        width: 50,
        fontSize: 31,
        color: '#666'
      },
      subQuestionNumber: {
        width: 110,
        fontSize: 31,
        paddingLeft: 50,
        color: '#666'
      },
      answer: {
        fontSize: 13,
        marginLeft: 20,
        fontWeight: 'bold'
      },
      answerSection: {
        display: 'inline-block',
        paddingBottom: 12,
        margin: '7px 5px 15px 0',
        fontSize: 15
      },
      answerLabel: {
        color: window.colorBlindModeOn ? 'black' : '#00BCD4',
        paddingBottom: 3
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)} className="flexbox row">
        <span style={this.props.question.parent ? styles.subQuestionNumber : styles.number}>
          <div>{this.props.question.question.numberToShow}</div>
        </span>
        <span className="fill" style={{display: 'inline-block'}}>
          <div style={{fontSize: 14}}>{this.props.question.question.text}</div>
          <div className="flexbox row">
            <span className="fill" style={styles.answerSection}>
              <div style={styles.answerLabel}>ANSWER:</div>
              <div style={styles.answer}>
                {this.props.question.question.type === COIConstants.QUESTION_TYPE.DATE ? formatDate(this.props.answer) : this.props.answer}
              </div>
            </span>
          </div>
        </span>
      </div>
    );
  }
}
