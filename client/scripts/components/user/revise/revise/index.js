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
import {isEmpty} from 'lodash';
import {AppHeader} from '../../../app-header';
import {PIReviewStore} from '../../../../stores/pi-review-store';
import RevisionHeader from '../revision-header';
import QuestionnaireSection from '../questionnaire-section';
import FileSection from '../file-section';
import EntitySection from '../entity-section';
import DeclarationSection from '../declaration-section';
import SidePanel from '../side-panel';
import PIReviewActions from '../../../../actions/pi-review-actions';
import {DisclosureActions} from '../../../../actions/disclosure-actions';

export class Revise extends React.Component {
  constructor() {
    super();

    const storeState = PIReviewStore.getState();
    this.state = {
      disclosure: storeState.disclosure,
      applicationState: storeState.applicationState,
      files: storeState.files
    };

    this.onChange = this.onChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentDidMount() {
    PIReviewStore.listen(this.onChange);
    PIReviewActions.loadDisclosure(this.props.params.id);
    DisclosureActions.setCurrentDisclosureId(this.props.params.id);
  }

  componentWillUnmount() {
    PIReviewStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = PIReviewStore.getState();
    this.setState({
      disclosure: storeState.disclosure,
      applicationState: storeState.applicationState,
      files: storeState.files
    });
  }

  onConfirm() {
    PIReviewActions.confirm(this.props.params.id);
  }

  render() {
    const {configState} = this.context;

    let questionnaireJsx;
    let entitiesJsx;
    let declarationsJsx;
    let submittedDate;
    let lastReviewDate;
    let disclosureType;
    let disclosureFilesJsx;
    if (this.state.disclosure) {
      lastReviewDate = this.state.disclosure.lastReviewDate;
      submittedDate = this.state.disclosure.submittedDate;
      disclosureType = this.state.disclosure.typeCd;

      const {
        questions,
        entities,
        declarations,
        id: disclosureId,
        configId
      } = this.state.disclosure;

      if (!isEmpty(questions)) {
        questionnaireJsx = (
          <QuestionnaireSection
            questions={questions}
          />
        );
      }

      if (!isEmpty(entities)) {
        entitiesJsx = (
          <EntitySection
            entitiesToReview={entities}
            disclosureId={parseInt(disclosureId)}
          />
        );
      }

      if (!isEmpty(declarations)) {
        declarationsJsx = (
          <DeclarationSection
            declarationsToReview={declarations}
            configId={configId}
            necessaryEntities={entities}
          />
        );
      }

      if (this.state.files) {
        disclosureFilesJsx = (
          <FileSection
            files={this.state.files}
            disclosureId={disclosureId}
          />
        );
      }
    }

    return (
      <div className={'flexbox column'} style={{height: '100%'}}>
        <AppHeader
          className={`${styles.override} ${styles.header}`}
          moduleName={'Conflict Of Interest'}
        />
        <div
          className={
            `fill flexbox column ${styles.container} ${this.props.className}`
          }
        >
          <RevisionHeader
            disclosureType={disclosureType}
            submittedDate={submittedDate}
            returnedDate={lastReviewDate}
          />
          <div className={'flexbox row fill'}>
            <span className={`fill ${styles.disclosure}`}>
              {questionnaireJsx}
              {entitiesJsx}
              {declarationsJsx}
              {disclosureFilesJsx}
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
