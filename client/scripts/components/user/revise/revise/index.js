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
import {AppHeader} from '../../../app-header';
import {PIReviewStore} from '../../../../stores/pi-review-store';
import RevisionHeader from '../revision-header';
import QuestionnaireSection from '../questionnaire-section';
import EntitySection from '../entity-section';
import DeclarationSection from '../declaration-section';
import SidePanel from '../side-panel';
import PIReviewActions from '../../../../actions/pi-review-actions';
import {LANES} from '../../../../../../coi-constants';

export class Revise extends React.Component {
  constructor() {
    super();

    const storeState = PIReviewStore.getState();
    this.state = {
      disclosure: storeState.disclosure,
      applicationState: storeState.applicationState
    };

    this.onChange = this.onChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentDidMount() {
    PIReviewStore.listen(this.onChange);
    PIReviewActions.loadDisclosure(this.props.params.id);
  }

  componentWillUnmount() {
    PIReviewStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = PIReviewStore.getState();
    this.setState({
      disclosure: storeState.disclosure,
      applicationState: storeState.applicationState
    });
  }

  onConfirm() {
    PIReviewActions.confirm(this.props.params.id);
  }

  render() {
    const {configState} = this.context;

    let questionnaire, entities, declarations, submittedDate, lastReviewDate;
    let disclosureType;
    if (this.state.disclosure) {
      if (this.state.disclosure.questions) {
        let questionsToDisplay = this.state.disclosure.questions;
        if (configState.config.lane !== LANES.TEST) {
          questionsToDisplay = questionsToDisplay.filter(question => {
            return question.comments && question.comments.length > 0;
          });
        }

        if (questionsToDisplay.length > 0) {
          questionnaire = (
            <QuestionnaireSection
              questions={questionsToDisplay}
            />
          );
        }
      }

      if (this.state.disclosure.entities) {
        let entitiesToReview = this.state.disclosure.entities;
        if (configState.config.lane !== LANES.TEST) {
          entitiesToReview = entitiesToReview.filter(entity => {
            return entity.comments && entity.comments.length > 0;
          });
        }

        if (entitiesToReview.length > 0) {
          entities = (
            <EntitySection
              entitiesToReview={entitiesToReview}
            />
          );
        }
      }

      if (this.state.disclosure.declarations) {
        let declarationsToReview = this.state.disclosure.declarations;
        if (configState.config.lane !== LANES.TEST) {
          declarationsToReview.forEach(project => {
            project.entities = project.entities.filter(entity => {
              return entity.adminComments && entity.adminComments.length > 0;
            });
          });
        }

        if (declarationsToReview.length > 0) {
          declarations = (
            <DeclarationSection
              declarationsToReview={declarationsToReview}
            />
          );
        }
      }

      lastReviewDate = this.state.disclosure.lastReviewDate;
      submittedDate = this.state.disclosure.submittedDate;
      disclosureType = this.state.disclosure.typeCd;
    }

    return (
      <div className={'flexbox column'} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <div className={`fill flexbox column ${styles.container} ${this.props.className}`}>
          <RevisionHeader
            disclosureType={disclosureType}
            submittedDate={submittedDate}
            returnedDate={lastReviewDate}
          />
          <div className={'flexbox row fill'}>
            <span className={`fill ${styles.disclosure}`}>
              {questionnaire}
              {entities}
              {declarations}
            </span>

            <SidePanel
              certificationText={configState.config.general.certificationOptions.text}
              showingCertification={this.state.applicationState.showingCertification}
              submitEnabled={this.state.applicationState.canSubmit}
              onConfirm={this.onConfirm}
            />
          </div>
        </div>
      </div>
    );
  }
}

Revise.contextTypes = {
  configState: React.PropTypes.object
};
