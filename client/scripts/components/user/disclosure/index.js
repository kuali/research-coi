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
import classNames from 'classnames';
import {AppHeader} from '../../app-header';
import {Sidebar} from '../sidebar';
import {DisclosureHeader} from '../disclosure-header';
import {DisclosureStore} from '../../../stores/disclosure-store';
import {DisclosureActions} from '../../../actions/disclosure-actions';
import {DISCLOSURE_STEP, DISCLOSURE_TYPE} from '../../../../../coi-constants';
import {Questionnaire} from '../questionnaire/questionnaire';
import {QuestionnaireSummary} from '../questionnaire-summary/questionnaire-summary';
import {ManualEvent} from '../manual/manual-event';
import {Relationships} from '../projects/relationships';
import {Entities} from '../entities/entities';
import {Certify} from '../certification/certify';
import {NavSidebar} from '../nav-sidebar';

export class Disclosure extends React.Component {
  constructor(props) {
    super(props);

    // Set up steps for the sidebar
    this.steps = [
      {label: 'Questionnaire', value: DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY},
      {label: 'Financial Entities', value: DISCLOSURE_STEP.ENTITIES}
    ];
    if (props.disclosuretype && props.disclosuretype.toLowerCase() === 'manual') {
      this.steps.push({label: 'Manual Event', value: DISCLOSURE_STEP.MANUAL});
    }
    else {
      this.steps.push({label: 'Project Declarations', value: DISCLOSURE_STEP.PROJECTS});
    }
    this.steps.push({label: 'Certification', value: DISCLOSURE_STEP.CERTIFY});

    const storeState = DisclosureStore.getState();
    this.state = {
      percent: 0,
      applicationState: storeState.applicationState,
      entities: storeState.entities,
      projects: storeState.projects,
      declarations: storeState.declarations,
      files: storeState.files
    };

    this.onChange = this.onChange.bind(this);
  }

  undefinedProjectRelationExists(entities, projects, relations) {
    if (!entities || !projects) {
      return false;
    }
    if (!relations && (entities.length > 0 || projects.length > 0)) {
      return true;
    }

    let undefinedFound = false;
    entities
      .filter(entity => {
        return entity.active === 1;
      })
      .forEach(entity => {
        projects.forEach(project => {
          const existingRelation = relations.find(relation => {
            return relation.finEntityId === entity.id &&
              (
                relation.projectId === project.id
              );
          });

          if (!existingRelation || !existingRelation.typeCd) {
            undefinedFound = true;
          }
        });
      });

    return undefinedFound;
  }

  undefinedManualRelationExists(entities, disclosure, relations) {
    if (!entities || !disclosure) {
      return false;
    }
    else if (!relations && entities.length > 0) {
      return true;
    }

    let undefinedFound = false;
    entities
      .filter(entity => {
        return entity.active === 1;
      })
      .forEach(entity => {
        const existingRelation = relations.find(relation => {
          return relation.finEntityId === entity.id && relation.manualId === disclosure.projectId;
        });

        if (!existingRelation || !existingRelation.typeCd) {
          undefinedFound = true;
        }
      });

    return undefinedFound;
  }

  incompleteEntityExists(entities) {
    if (!entities) {
      return false;
    }

    const entityInProgress = this.state.applicationState.entityInProgress;
    if (entityInProgress && entityInProgress.name) {
      return true;
    }

    let incompleteEntity = false;
    entities.filter(entity => {
      return entity.active === 1;
    })
    .forEach(entity => {
      if (
        !DisclosureStore.entityInformationStepComplete(entity.id) ||
        !DisclosureStore.entityRelationshipsAreSubmittable(entity.id)
      ) {
        incompleteEntity = true;
      }
    });
    return incompleteEntity;
  }
  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    const disclosureType = this.props.location.query.type;
    DisclosureActions.loadDisclosureData(disclosureType);
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = DisclosureStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      entities: storeState.entities,
      projects: storeState.projects,
      declarations: storeState.declarations,
      files: storeState.files
    });
  }

  render() {
    const {config} = this.context.configState;
    const currentDisclosureId = this.state.applicationState.currentDisclosureState.disclosure.id;
    const currentDisclosureState = this.state.applicationState.currentDisclosureState;
    const currentDisclosureStep = currentDisclosureState.step;
    const currentQuestion = currentDisclosureState.question;

    let stepNumber = 0;
    let percent = 0;
    let heading;
    let currentStep;
    let nextDisabled;
    const QUESTIONNAIRE_PERCENTAGE = 25;
    let previousLinkLabel = 'PREVIOUS STEP';
    let showPreviousLink = true;
    const showNextLink = (
      currentDisclosureStep !== DISCLOSURE_STEP.QUESTIONNAIRE &&
      currentDisclosureStep !== DISCLOSURE_STEP.CERTIFY &&
      !nextDisabled
    );

    const loading = currentDisclosureId === -1;
    if (loading) {
      heading = 'Loading disclosure...';
      showPreviousLink = false;
    } else {
      switch (currentDisclosureStep) {
        case DISCLOSURE_STEP.QUESTIONNAIRE: {
          if (config.questions.screening) {
            percent = Math.floor(((currentQuestion - 1) / config.questions.screening.length) * QUESTIONNAIRE_PERCENTAGE);
          }

          const question = currentQuestion;
          currentStep = (
            <Questionnaire
              questions={config.questions.screening}
              answers={currentDisclosureState.disclosure.answers}
              currentquestion={question}
              disclosureid={currentDisclosureId}
              instructionsShowing={this.state.applicationState.instructionsShowing}
            />
          );
          heading = 'Questionnaire';
          previousLinkLabel = 'PREVIOUS QUESTION';
          showPreviousLink = currentQuestion > 1;

          break;
        }
        case DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
          percent = QUESTIONNAIRE_PERCENTAGE;
          currentStep = (
            <QuestionnaireSummary
              questions={config.questions.screening}
              instructionsShowing={this.state.applicationState.instructionsShowing}
              answers={this.state.applicationState.currentDisclosureState.disclosure.answers}
            />
          );
          heading = 'Questionnaire';
          break;
        case DISCLOSURE_STEP.ENTITIES: {
          stepNumber = 1;
          const ENTITIES_PERCENTAGE = 50;
          percent = ENTITIES_PERCENTAGE;
          const enforceEntities = DisclosureStore.enforceEntities(
            this.state.applicationState.currentDisclosureState.disclosure,
            config
          );
          nextDisabled = this.incompleteEntityExists(this.state.entities) ||
            enforceEntities;
          currentStep = (
            <Entities
              enforceEntities={enforceEntities}
              applicationState={this.state.applicationState}
              entities={this.state.entities}
              inProgress={this.state.applicationState.entityInProgress}
              instructionsShowing={this.state.applicationState.instructionsShowing}
            />
          );

          heading = 'Financial Entities';
          break;
        }
        case DISCLOSURE_STEP.PROJECTS: {
          stepNumber = 2;
          const PROJECTS_PERCENTAGE = 75;
          percent = PROJECTS_PERCENTAGE;
          const disclosureType = this.props.location.query.type;
          if (disclosureType === DISCLOSURE_TYPE.MANUAL) {
            const disclosure = this.state.applicationState.currentDisclosureState.disclosure;
            currentStep = (
              <ManualEvent
                step={this.state.applicationState.manualStep}
                disclosure={disclosure}
                type={disclosure.manualType}
                entities={this.state.entities}
                relations={this.state.declarations}
                declarationStates={this.state.applicationState.declarationStates}
                instructionsShowing={this.state.applicationState.instructionsShowing}
              />
            );
            heading = 'Manual Event';
            nextDisabled = this.undefinedManualRelationExists(
              this.state.entities,
              disclosure,
              this.state.declarations
            );
          }
          else {
            const activeEntities = this.state.entities.filter(entity => entity.active);
            const declarationTypes = config.declarationTypes.filter(
              type => Boolean(type.active)
            );
            currentStep = (
              <Relationships
                projects={this.state.projects}
                entities={activeEntities}
                declarations={this.state.declarations}
                declarationStates={this.state.applicationState.declarationStates}
                view={this.state.applicationState.declarationView}
                declarationTypes={declarationTypes}
                instructionsShowing={this.state.applicationState.instructionsShowing}
              />
            );
            heading = 'Project Declarations';
            nextDisabled = this.undefinedProjectRelationExists(
              this.state.entities,
              this.state.projects,
              this.state.declarations
            );
          }
          break;
        }
        case DISCLOSURE_STEP.CERTIFY: {
          stepNumber = 3;
          const CERTIFY_PERCENTAGE = 99;
          percent = CERTIFY_PERCENTAGE;
          currentStep = (
            <Certify
              instructionsShowing={this.state.applicationState.instructionsShowing}
              isCertified={this.state.applicationState.currentDisclosureState.isCertified}
              files={this.state.files}
            />
          );
          heading = 'Certification';
          break;
        }
      }
    }

    const submitDisabled = config.general.certificationOptions.required ? !this.state.applicationState.currentDisclosureState.isCertified : false;

    const classes = classNames(
      'flexbox',
      'column',
      {[styles.loading]: loading}
    );

    return (
      <div className={classes} style={{minHeight: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <div className={`flexbox row fill ${styles.container} ${this.props.className}`}>
          <Sidebar
            className={`${styles.override} ${styles.sidebar}`}
            steps={this.steps}
            activestep={stepNumber}
            visitedSteps={this.state.applicationState.currentDisclosureState.visitedSteps}
          />

          <span className={`fill ${styles.content}`}>
            <DisclosureHeader>{heading}</DisclosureHeader>

            <span className={styles.middle}>
              {currentStep}
            </span>

            <NavSidebar
              percentComplete={percent}
              previousLabel={previousLinkLabel}
              submitDisabled={submitDisabled}
              nextDisabled={nextDisabled}
              showNextLink={showNextLink}
              showPreviousLink={showPreviousLink}
              showSubmitLink={currentDisclosureStep === DISCLOSURE_STEP.CERTIFY}
            />
          </span>
        </div>
      </div>
    );
  }
}

Disclosure.contextTypes = {
  configState: React.PropTypes.object
};
