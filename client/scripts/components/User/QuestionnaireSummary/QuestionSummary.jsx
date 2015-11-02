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
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {COIConstants} from '../../../../../COIConstants';
import {formatDate} from '../../../../scripts/formatDate';

export class QuestionSummary extends React.Component {
  constructor() {
    super();

    this.reviewQuestion = this.reviewQuestion.bind(this);
  }

  reviewQuestion() {
    DisclosureActions.setCurrentQuestion(this.props.index + 1);
  }

  render() {
    let styles = {
      container: {
        margin: '35px 0px'
      },
      option: {
        display: 'inline-block',
        marginRight: 30
      },
      counter: {
        display: 'inline-block',
        width: this.props.question.parent !== null ? 170 : 100,
        paddingLeft: this.props.question.parent !== null ? 80 : 0,
        fontSize: 17,
        verticalAlign: 'top'
      },
      controls: {
        marginTop: 20
      },
      radio: {
        width: 36,
        height: '4em'
      },
      nums: {
        fontSize: 28,
        marginLeft: 10
      },
      question: {
        marginTop: 3,
        lineHeight: '22px'
      },
      answer: {
        display: 'inline-block',
        verticalAlign: 'top'
      },
      editlink: {
        fontSize: 15,
        margin: '10px 0 0 8px',
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        cursor: 'pointer',
        borderBottom: window.colorBlindModeOn ? '1px dotted black' : '1px dotted #0095A0',
        display: 'inline-block'
      },
      answerLabel: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 18,
        marginRight: 7
      }
    };

    let answer = this.props.answer;
    switch(this.props.question.question.type) {
      case COIConstants.QUESTION_TYPE.DATE:
        answer = formatDate(this.props.answer);
        break;
      case COIConstants.QUESTION_TYPE.MULTISELECT:
        if (this.props.answer.length > 1) {
          answer = this.props.answer.join(', ');
        }
    }

    return (
      <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={styles.counter}>
          <span style={styles.nums}>
            {this.props.question.question.numberToShow}
          </span>
        </span>

        <span className="fill" style={styles.question}>
          <div>{this.props.question.question.text}</div>
          <div style={{marginTop: 15}} className="flexbox row">
            <span className="fill" style={styles.answer}>
              <span style={styles.answerLabel}>Answer: </span>
              <span style={{fontSize: 20}}>
                {answer}
              </span>
            </span>
            <span onClick={this.reviewQuestion}>
              <span style={styles.editlink}>&lt; EDIT</span>
            </span>
          </div>
        </span>
      </div>
    );
  }
}
