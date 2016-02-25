/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {Question} from '../question';
import {COIConstants} from '../../../../../../coi-constants';
import {FileUpload} from '../../../file-upload';

export class EntityFormInformationStep extends React.Component {
  constructor() {
    super();

    this.getAnswer = this.getAnswer.bind(this);
    this.addEntityAttachments = this.addEntityAttachments.bind(this);
    this.deleteEntityAttachment = this.deleteEntityAttachment.bind(this);
    this.onAnswer = this.onAnswer.bind(this);
  }

  onAnswer(newValue, questionId) {
    this.props.onAnswerQuestion(newValue, questionId);
  }

  getAnswer(id) {
    if (this.props.answers) {
      const answerForId = this.props.answers.find(answer => {
        return answer.questionId === id;
      });
      if (answerForId) {
        return answerForId.answer.value;
      }
    }
  }

  addEntityAttachments(files) {
    this.props.addEntityAttachments(files, this.props.id);
  }

  deleteEntityAttachment(index) {
    this.props.deleteEntityAttachment(index, this.props.id);
  }

  render() {
    let validationErrors;
    if (this.props.validating) {
      validationErrors = DisclosureStore.entityInformationStepErrors(this.props.id);
    }

    let heading = null;
    if (!this.props.update) {
      if (this.props.name) {
        heading = (
          <div className={styles.title}>
            {this.props.name}
            <span style={{marginLeft: 3}}>Information</span>
          </div>
        );
      }
      else {
        heading = (
          <div className={styles.title}>Add New Financial Entity</div>
        );
      }
    }


    const questions = window.config.questions.entities.sort((a, b) => {
      return a.question.order - b.question.order;
    }).map((question, index) => {
      let columnStyle;
      if (question.question.type === COIConstants.QUESTION_TYPE.TEXTAREA) {
        columnStyle = styles.longColumn;
      } else {
        columnStyle = styles.column;
      }
      return (
        <div className={columnStyle} key={index}>
          <Question
            readonly={this.props.readonly}
            entityId={this.props.id}
            id={question.id}
            answer={this.getAnswer(question.id)}
            question={question}
            disclosureid={this.props.disclosureid}
            invalid={validationErrors ? validationErrors.includes(question.id) : false}
            onAnswer={this.onAnswer}
          />
        </div>
      );
    });

    let attachmentSection;
    if (!this.props.readonly || this.props.files && this.props.files.length > 0) {
      attachmentSection = (
        <div>
          <div className={styles.attachmentLabel}>
            ATTACHMENTS
          </div>

          <FileUpload
            fileType='Attachment'
            readonly={this.props.readonly}
            onDrop={this.addEntityAttachments}
            delete={this.deleteEntityAttachment}
            files={this.props.files}
            multiple={true}
          >
            <div>Drag and drop or click to upload your attachments</div>
            <div>Acceptable Formats: .pdf, .png, .doc, .jpeg</div>
          </FileUpload>
        </div>
      );
    }

    return (
      <span className={`${styles.container} ${this.props.className}`}>
        {heading}
        <div style={{color: '#333'}}>
          {questions}
        </div>

        {attachmentSection}
      </span>
    );
  }
}
