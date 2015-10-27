import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {Question} from './Question';
import {COIConstants} from '../../../../../COIConstants';
import {FileUpload} from '../../FileUpload';

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
      let answerForId = this.props.answers.find(answer => {
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

    let styles = {
      container: {
      },
      title: {
        fontWeight: 'bold',
        fontSize: 17,
        color: window.colorBlindModeOn ? 'black' : '#0095A0'
      },
      column: {
        width: '33%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      longColumn: {
        width: '66%',
        display: 'inline-block',
        verticalAlign: 'top'
      }
    };

    let heading = null;
    if (!this.props.update) {
      if (this.props.name) {
        heading = (
          <div style={styles.title}>{this.props.name} Information</div>
        );
      }
      else {
        heading = (
          <div style={styles.title}>Add New Financial Entity</div>
        );
      }
    }


    let questions = window.config.questions.entities.sort((a, b)=>{
      return a.question.order - b.question.order;
    }).map((question, index)=>{
      let columnStyle;
      if (question.question.type === COIConstants.QUESTION_TYPE.TEXTAREA) {
        columnStyle = styles.longColumn;
      } else {
        columnStyle = styles.column;
      }
      return (
        <div style={columnStyle} key={index}>
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

    return (
      <span style={merge(styles.container, this.props.style)}>
        {heading}
        <div>
          {questions}
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
      </span>
    );
  }
}
