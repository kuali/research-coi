import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureDetailHeading} from './DisclosureDetailHeading';
import {ActionButtons} from './ActionButtons';
import {AdminQuestionnaireSummary} from './AdminQuestionnaireSummary';
import {AdminEntitiesSummary} from './AdminEntitiesSummary';
import {AdminDeclarationsSummary} from './AdminDeclarationsSummary';
import {ApprovalConfirmation} from './ApprovalConfirmation';
import {RejectionConfirmation} from './RejectionConfirmation';

export class DisclosureDetail extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  makeEntityMap(entities) {
    let result = {};
    if (entities !== undefined) {
      for (let i = 0; i < entities.length; i++) {
        result[entities[i].id] = entities[i].name;
      }
    }

    return result;
  }

  renderMobile() {}

  renderDesktop() {
    let nameMap = this.makeEntityMap(this.props.disclosure.entities);

    let desktopStyles = {
      container: {},
      actionButtons: {
        position: 'fixed',
        top: 186,
        right: 20,
        display: this.props.showApproval || this.props.showRejection ? 'none' : 'block'
      },
      bottom: {
        position: 'relative',
        padding: '25px 225px 25px 25px',
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
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div className="inline-flexbox column" style={merge(styles.container, this.props.style)} >
        <DisclosureDetailHeading disclosure={this.props.disclosure} />
        <div className="fill" ref="bottom" style={styles.bottom}>
          <ApprovalConfirmation id={this.props.disclosure.id} style={styles.confirmation} />
          <RejectionConfirmation id={this.props.disclosure.id} style={styles.rejection} />
          <ActionButtons style={styles.actionButtons} />
          <AdminQuestionnaireSummary
            questions={this.props.disclosure.questionnaire}
            style={styles.questionnaire}
            id={this.props.disclosure.id}
            comment={this.props.disclosure.comments ? this.props.disclosure.comments.questionnaire : null}
            expandedComments={this.props.showingQuestionnaireComments} />
          <AdminEntitiesSummary
            entities={this.props.disclosure.entities}
            style={styles.entities}
            id={this.props.disclosure.id}
            comment={this.props.disclosure.comments ? this.props.disclosure.comments.entities : null}
            expandedComments={this.props.showingEntitiesComments} />
          <AdminDeclarationsSummary
            names={nameMap}
            relationships={this.props.disclosure.projects}
            id={this.props.disclosure.id}
            comment={this.props.disclosure.comments ? this.props.disclosure.comments.projects : null}
            expandedComments={this.props.showingProjectComments} />
        </div>
      </div>
    );
  }
}
