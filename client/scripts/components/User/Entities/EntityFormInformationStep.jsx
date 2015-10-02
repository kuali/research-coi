import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {Question} from './Question';
import {COIConstants} from '../../../../../COIConstants';
import {FileUpload} from '../../FileUpload';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class EntityFormInformationStep extends React.Component {
  constructor() {
    super();

    this.getAnswer = this.getAnswer.bind(this);
    this.addEntityAttachments = this.addEntityAttachments.bind(this);
    this.deleteEntityAttachment = this.deleteEntityAttachment.bind(this);
  }

  getAnswer(id) {
    let answer = this.props.answers.find(a => {
      return a.questionId === id;
    });
    if (answer) {
      return answer.answer.value;
    }
  }

  addEntityAttachments(files) {
    DisclosureActions.addEntityAttachments(files, this.props.id);
  }

  deleteEntityAttachment(index) {
    DisclosureActions.deleteEntityAttachment(index, this.props.id);
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
        color: '#1481A3'
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
        <div style={columnStyle}>
          <Question
          readonly={this.props.readonly}
          entityId={this.props.id}
          id={question.id}
          answer={this.getAnswer(question.id)}
          question={question}
          disclosureid={this.props.disclosureid}
          key={index}
          invalid={validationErrors ? validationErrors.includes(question.id) : false}
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
          readonly={this.props.readonly}
          onDrop={this.addEntityAttachments}
          delete={this.deleteEntityAttachment}
          getFile={this.getFile}
          files={this.props.files}>
          <p>Drag and Drop or Click to upload your attachments</p>
          <p>Acceptable Formats: .pdf, .png, .doc, .jpeg</p>
        </FileUpload>
      </span>
    );
  }
}
