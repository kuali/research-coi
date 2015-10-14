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
  }

  componentWillReceiveProps() {
    let detailPanel = React.findDOMNode(this.refs.detailPanel);
    detailPanel.scrollTop = 0;
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

  render() {
    let entityNameMap = this.makeEntityMap();

    let styles = {
      container: {
        width: '100%'
      },
      actionButtons: {
        top: 145,
        right: 20,
        display: this.props.showApproval || this.props.showRejection ? 'none' : 'block'
      },
      bottom: {
        position: 'relative',
        padding: '25px 25px 25px 25px',
        minHeight: 0
      },
      confirmation: {
        display: this.props.showApproval ? 'block' : 'none',
        position: 'fixed',
        top: 186,
        right: 20
      },
      rejection: {
        display: this.props.showRejection ? 'block' : 'none',
        position: 'fixed',
        top: 186,
        right: 20
      },
      questionnaire: {
        marginBottom: 25
      },
      entities: {
        marginBottom: 25
      },
      detailsFromPI: {
        overflowY: 'auto',
        paddingRight: 35
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
            />
            <AdminEntitiesSummary
              questions={entityQuestions}
              entities={this.props.disclosure.entities}
              comments={entitiesComments}
              style={styles.entities} />
            <AdminDeclarationsSummary
              entityNameMap={entityNameMap}
              declarations={this.props.disclosure.declarations}
              comments={declarationsComments}
              id={this.props.disclosure.id} />
          </span>
          <span>
            <ApprovalConfirmation id={this.props.disclosure.id} style={styles.confirmation} />
            <RejectionConfirmation id={this.props.disclosure.id} style={styles.rejection} />
            <ActionButtons
              style={styles.actionButtons}
              showAttachments={this.props.disclosure.files.length > 0}
              isApproved={this.props.disclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE}/>
          </span>
        </div>
      </div>
    );
  }
}
