import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureDetailHeading} from './DisclosureDetailHeading';
import {ActionButtons} from './ActionButtons';
import {AdminQuestionnaireSummary} from './AdminQuestionnaireSummary';
import {AdminEntitiesSummary} from './AdminEntitiesSummary';
import {AdminDeclarationsSummary} from './AdminDeclarationsSummary';
import {ApprovalConfirmation} from './ApprovalConfirmation';
import {RejectionConfirmation} from './RejectionConfirmation';

export class DisclosureDetail extends React.Component {
  constructor() {
    super();

    this.findScreeningQuestion = this.findScreeningQuestion.bind(this);
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
        position: 'fixed',
        top: 145,
        right: 20,
        display: this.props.showApproval || this.props.showRejection ? 'none' : 'block'
      },
      bottom: {
        position: 'relative',
        padding: '25px 270px 25px 25px',
        overflowY: 'auto'
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
      }
    };

    let screeningQuestions = this.props.config.questions.screening.sort((a, b) => {
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
    let screeningAnswers = {};
    this.props.disclosure.answers.forEach(answer => {
      screeningAnswers[answer.questionId] = answer.answer.value;
    });

    let commentCounts = {
      1: 99,
      2: 999,
      3: 9,
      4: -2,
      5: 88,
      6: 33,
      7: 3,
      8: 9999
    };

    return (
      <div className="inline-flexbox column" style={merge(styles.container, this.props.style)} >
        <DisclosureDetailHeading disclosure={this.props.disclosure} />
        <div className="fill" ref="bottom" style={styles.bottom}>
          <ApprovalConfirmation id={this.props.disclosure.id} style={styles.confirmation} />
          <RejectionConfirmation id={this.props.disclosure.id} style={styles.rejection} />
          <ActionButtons style={styles.actionButtons} />
          <AdminQuestionnaireSummary
            questions={screeningQuestions}
            answers={screeningAnswers}
            commentCounts={commentCounts}
            style={styles.questionnaire}
          />
          <AdminEntitiesSummary
            entities={this.props.disclosure.entities}
            style={styles.entities} />
          <AdminDeclarationsSummary
            entityNameMap={entityNameMap}
            declarations={this.props.disclosure.declarations}
            projects={this.props.disclosure.associatedProjects}
            id={this.props.disclosure.id} />
        </div>
      </div>
    );
  }
}
