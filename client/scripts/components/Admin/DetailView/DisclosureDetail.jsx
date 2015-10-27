import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureDetailHeading} from './DisclosureDetailHeading';
import {ActionButtons} from './ActionButtons';
import {AdminQuestionnaireSummary} from './AdminQuestionnaireSummary';
import {AdminEntitiesSummary} from './AdminEntitiesSummary';
import {AdminDeclarationsSummary} from './AdminDeclarationsSummary';
import {ApprovalConfirmation} from './ApprovalConfirmation';
import {RejectionConfirmation} from './RejectionConfirmation';
import {COIConstants} from '../../../../../COIConstants';

export class DisclosureDetail extends React.Component {
  constructor() {
    super();

    this.findScreeningQuestion = this.findScreeningQuestion.bind(this);
    this.getResponses = this.getResponses.bind(this);
  }

  makeEntityMap() {
    let result = {};
    let entities = this.props.disclosure.entities;
    if (entities !== undefined) {
      entities.forEach(entity => {
        result[entity.id] = entity.name;
      });
    }

    return result;
  }

  findScreeningQuestion(questionId) {
    return this.props.config.questions.screening.find(question => {
      if (question.id === questionId) {
        return true;
      }
      return false;
    });
  }

  getResponses(type) {
    let responses = [];
    if (this.props.piResponses && Array.isArray(this.props.piResponses)) {
      responses = this.props.piResponses.filter(response => {
        return response.targetType === type;
      });
    }

    return responses;
  }

  render() {
    let entityNameMap = this.makeEntityMap();

    let styles = {
      container: {
        width: '100%'
      },
      actionButtons: {
        display: this.props.showApproval || this.props.showRejection ? 'none' : 'block',
        marginTop: 25,
        marginRight: 25
      },
      bottom: {
        position: 'relative',
        paddingLeft: 25,
        minHeight: 0,
        backgroundColor: '#EEEEEE'
      },
      confirmation: {
        display: this.props.showApproval ? 'block' : 'none',
        top: 186,
        right: 20
      },
      rejection: {
        display: this.props.showRejection ? 'block' : 'none'
      },
      questionnaire: {
        marginBottom: 25,
        marginTop: 25
      },
      entities: {
        marginBottom: 25
      },
      detailsFromPI: {
        overflowY: 'auto',
        padding: '0 35px 0 3px',
        display: 'inline-block'
      }
    };

    let screeningQuestions = this.props.config.questions.screening.filter(question => {
      return question.active !== 0;
    }).sort((a, b) => {
      let aParent, bParent;
      if (a.parent) {
        aParent = this.findScreeningQuestion(a.parent);
      }
      if (b.parent) {
        bParent = this.findScreeningQuestion(b.parent);
      }

      if (!aParent && !bParent) {
        return a.question.order - b.question.order;
      }
      else if (a.parent && b.parent) {
        if (a.parent === b.parent) {
          return a.question.order - b.question.order;
        }
        else {
          return aParent.question.order - bParent.question.order;
        }
      }
      else if (a.parent && !b.parent) {
        return aParent.question.order - b.question.order;
      }
      else {
        return a.question.order - bParent.question.order;
      }
    }).map(question => {
      return {
        id: question.id,
        parent: question.parent,
        order: question.question.order,
        numberToShow: question.question.numberToShow,
        text: question.question.text,
        type: question.question.type
      };
    });

    let entityQuestions = this.props.config.questions.entities.filter(question => {
      return question.active !== 0;
    }).sort((a, b) => {
      return a.question.order - b.question.order;
    }).map(question => {
      return {
        id: question.id,
        text: question.question.text,
        type: question.question.type
      };
    });
    let screeningAnswers = {};
    this.props.disclosure.answers.forEach(answer => {
      screeningAnswers[answer.questionId] = answer.answer.value;
    });

    let questionnaireComments = this.props.disclosure.comments.filter(comment => {
      return comment.topicSection === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
    });

    let entitiesComments = this.props.disclosure.comments.filter(comment => {
      return comment.topicSection === COIConstants.DISCLOSURE_STEP.ENTITIES;
    });

    let declarationsComments = this.props.disclosure.comments.filter(comment => {
      return comment.topicSection === COIConstants.DISCLOSURE_STEP.PROJECTS;
    });


    let piComments = this.props.disclosure.comments.filter(comment => {
      return comment.piVisible;
    });

    return (
      <div className="inline-flexbox column" style={merge(styles.container, this.props.style)} >
        <DisclosureDetailHeading disclosure={this.props.disclosure} />
        <div className="fill flexbox row" style={styles.bottom}>
          <span className="fill" style={styles.detailsFromPI} ref="detailPanel">
            <AdminQuestionnaireSummary
              questions={screeningQuestions}
              answers={screeningAnswers}
              comments={questionnaireComments}
              style={styles.questionnaire}
              piResponses={this.getResponses(COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE)}
            />
            <AdminEntitiesSummary
              questions={entityQuestions}
              entities={this.props.disclosure.entities}
              comments={entitiesComments}
              style={styles.entities}
              piResponses={this.getResponses(COIConstants.DISCLOSURE_STEP.ENTITIES)}
            />
            <AdminDeclarationsSummary
              entityNameMap={entityNameMap}
              declarations={this.props.disclosure.declarations}
              comments={declarationsComments}
              id={this.props.disclosure.id}
              piResponses={this.getResponses(COIConstants.DISCLOSURE_STEP.PROJECTS)}
              style={{marginBottom: 25}}
            />
          </span>
          <span style={{display: 'inline-block'}}>
            <ApprovalConfirmation id={this.props.disclosure.id} style={styles.confirmation} />
            <RejectionConfirmation id={this.props.disclosure.id} canReject={piComments.length > 0 } style={styles.rejection} />
            <ActionButtons
              style={styles.actionButtons}
              showAttachments={this.props.disclosure.files.length > 0}
              readonly={this.props.disclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE || this.props.disclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED}/>
          </span>
        </div>
      </div>
    );
  }
}
