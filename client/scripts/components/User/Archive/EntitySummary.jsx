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
import {COIConstants} from '../../../../../COIConstants';
import {formatDate} from '../../../formatDate';
import EntityRelationshipSummary from '../../EntityRelationshipSummary';

export default class EntitySummary extends React.Component {
  getQuestionAnswer(questionId, entity, type) {
    let theAnswer = entity.answers.find(answer => {
      return answer.questionId === questionId;
    });
    if (!theAnswer) {
      return '';
    }
    else {
      switch (type) {
        case COIConstants.QUESTION_TYPE.DATE:
          if (isNaN(theAnswer.answer.value)) {
            return theAnswer.answer.value;
          }
          else {
            return formatDate(theAnswer.answer.value);
          }
          break;
        case COIConstants.QUESTION_TYPE.TEXTAREA:
          return (
            <div>
              {theAnswer.answer.value}
            </div>
          );
        case COIConstants.QUESTION_TYPE.MULTISELECT:
          if (Array.isArray(theAnswer.answer.value)) {
            let answers = theAnswer.answer.value.map((answer, index, array) => {
              let answerToShow = answer;
              if (index !== array.length - 1) {
                answerToShow += ', ';
              }
              return (
                <span key={'ans' + questionId + index}>{answerToShow}</span>
              );
            });

            return (
              <div>
                {answers}
              </div>
            );
          }
          else {
            return theAnswer.answer.value;
          }
          break;
        default:
          return theAnswer.answer.value;
      }
    }
  }

  render() {
    let styles = {
      container: {
        padding: '20px 0 10px 0'
      },
      entity: {
        borderBottom: '1px solid #999'
      },
      highlighted: {
        borderLeft: window.colorBlindModeOn ? '10px solid black' : '10px solid #F57C00',
        marginLeft: -20,
        paddingLeft: 10
      },
      name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 11
      },
      fieldLabel: {
        fontWeight: 'bold',
        display: 'inline-block'
      },
      fieldValue: {
        marginLeft: 4,
        display: 'inline-block'
      },
      relations: {
        display: 'inline-block',
        width: '60%',
        verticalAlign: 'top'
      },
      left: {
        display: 'inline-block',
        width: '40%',
        verticalAlign: 'top',
        fontSize: 13,
        paddingRight: 4
      },
      commentLink: {
        fontSize: 14,
        cursor: 'pointer',
        textAlign: 'right',
        verticalAlign: 'bottom',
        width: '30%',
        display: 'inline-block'
      },
      relationshipsLabel: {
        marginBottom: 8,
        color: window.colorBlindModeOn ? 'black' : '#888',
        fontSize: 12
      },
      relationshipSummary: {
        marginBottom: 10
      },
      bottom: {
        margin: '25px 0 34px 0',
        width: '100%',
        display: 'inline-block'
      },
      bottomLeft: {
        width: '70%',
        display: 'inline-block'
      },
      commentLabel: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        borderBottom: window.colorBlindModeOn ? '1px dashed black' : '1px dashed #0095A0',
        paddingBottom: 3
      }
    };

    let fields = this.props.questions.map(question => {
      return (
        <div key={'qa' + question.id} style={{marginBottom: 8}}>
          <span style={styles.fieldLabel}>{question.question.text}</span>
          <span style={styles.fieldValue}>{this.getQuestionAnswer(question.id, this.props.entity, question.question.type)}</span>
        </div>
      );
    });

    let relationships = this.props.entity.relationships.map(relationship => {
      return (
        <EntityRelationshipSummary
          key={'rel' + relationship.id}
          style={styles.relationshipSummary}
          relationship={relationship}
          readonly={true}
        />
      );
    });


    let files = this.props.entity.files.map(file => {
      return (
        <div key={file.id} style={{marginBottom: 5}}>
          <a style={{color: window.colorBlindModeOn ? 'black' : '#0095A0', borderBottom: '1px dotted ' + (window.colorBlindModeOn ? 'black' : '#0095A0')}} href={'/api/coi/files/' + encodeURIComponent(file.id)}>{file.name}</a>
        </div>
      );
    });

    let effectiveStyle = styles.container;
    if (this.props.changedByPI) {
      effectiveStyle = merge(effectiveStyle, styles.highlighted);
    }
    if (!this.props.isLast) {
      effectiveStyle = merge(effectiveStyle, styles.entity);
    }
    effectiveStyle = merge(effectiveStyle, this.props.style);

    let attachmentSection;
    if (files.length > 0) {
      attachmentSection = (
        <div style={styles.bottomLeft}>
          <div>Attachments</div>
          {files}
        </div>
      );
    }

    return (
      <div style={effectiveStyle}>
        <div style={styles.name}>{this.props.entity.name}</div>
        <div>
          <span style={styles.left}>
            {fields}
          </span>
          <span style={styles.relations}>
            <div style={styles.relationshipsLabel}>RELATIONSHIP(S)</div>
            {relationships}
          </span>
          <div style={styles.bottom}>
            {attachmentSection}
          </div>
        </div>
      </div>
    );
  }
}
