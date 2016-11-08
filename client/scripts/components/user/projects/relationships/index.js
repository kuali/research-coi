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
import {uniq} from 'lodash';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {Project} from '../project';
import {Entity} from '../entity';
import {Toggle} from '../../toggle';
import {Instructions} from '../../instructions';
import {INSTRUCTION_STEP} from '../../../../../../coi-constants';
import {getProjectTypeString} from '../../../../stores/config-store';

export class Relationships extends React.Component {
  constructor() {
    super();

    this.openNext = this.openNext.bind(this);
    this.openPrevious = this.openPrevious.bind(this);
    this.getEntityDeclarations = this.getEntityDeclarations.bind(this);
    this.getProjectDeclarations = this.getProjectDeclarations.bind(this);
    this.isProjectDeclarationOpen = this.isProjectDeclarationOpen.bind(this);
    this.isEntityDeclarationOpen = this.isEntityDeclarationOpen.bind(this);
    this.viewChanged = this.viewChanged.bind(this);
  }

  shouldComponentUpdate() { return true; }

  openNext(currentIndex, type) {
    if (type === 'PROJECT') {
      const currentId = this.props.projects[currentIndex].id;
      DisclosureActions.toggleDeclaration(currentId, type);
      let nextId;
      if (this.props.projects[currentIndex + 1]) {
        nextId = this.props.projects[currentIndex + 1].id;
        DisclosureActions.toggleDeclaration(nextId, type);
      }
    }
    else {
      const currentId = this.props.entities[currentIndex].id;
      DisclosureActions.toggleDeclaration(currentId, type);
      let nextId;
      if (this.props.entities[currentIndex + 1]) {
        nextId = this.props.entities[currentIndex + 1].id;
        DisclosureActions.toggleDeclaration(nextId, type);
      }
    }
  }

  openPrevious(currentIndex, type) {
    if (type === 'PROJECT') {
      const currentId = this.props.projects[currentIndex].id;
      DisclosureActions.toggleDeclaration(currentId, type);
      let previousId;
      if (this.props.projects[currentIndex - 1]) {
        previousId = this.props.projects[currentIndex - 1].id;
        DisclosureActions.toggleDeclaration(previousId, type);
      }
    }
    else {
      const currentId = this.props.entities[currentIndex].id;
      DisclosureActions.toggleDeclaration(currentId, type);
      let previousId;
      if (this.props.entities[currentIndex - 1]) {
        previousId = this.props.entities[currentIndex - 1].id;
        DisclosureActions.toggleDeclaration(previousId, type);
      }
    }
  }

  getEntityDeclarations(id) {
    if (this.props.declarations) {
      return this.props.declarations.filter(element => {
        return element.finEntityId === id;
      });
    }

    return [];
  }

  getProjectDeclarations(id) {
    if (this.props.declarations) {
      return this.props.declarations.filter(element => {
        return element.projectId === id;
      });
    }

    return [];
  }

  isProjectDeclarationOpen(id) {
    if (this.props.declarationStates && this.props.declarationStates.projects) {
      const state = this.props.declarationStates.projects[id];
      return (state && state.open);
    }

    return false;
  }

  isEntityDeclarationOpen(id) {
    if (this.props.declarationStates && this.props.declarationStates.entities) {
      const state = this.props.declarationStates.entities[id];
      return (state && state.open);
    }

    return false;
  }

  viewChanged(newView) {
    DisclosureActions.changeDeclarationView(newView);
  }

  render() {
    const {
      projects,
      entities,
      declarationTypes,
      view,
      instructionsShowing,
      className
    } = this.props;
    const {config} = this.context.configState;
    const projectView = view === 0;
    const relationshipNodes = [];
    let declarations;
    let skipStepMessage;
    let toggle;
    if (!Array.isArray(entities) || entities.length === 0) {
      skipStepMessage = (
        <div className={styles.skipStepMessage}>
          You can proceed to the next step because
          you have no financial entities to report.
        </div>
      );
    }
    else if (!Array.isArray(projects) || projects.length === 0) {
      skipStepMessage = (
        <div className={styles.skipStepMessage}>
          You can proceed to the next step because
          you have no projects.
        </div>
      );
    }
    else {
      toggle = (
        <div style={{textAlign: 'right'}}>
          <Toggle
            values={[{code: 0, description: 'Project View'}, {code: 1, description: 'SFI View'}]}
            selected={view}
            onChange={this.viewChanged}
            className={`${styles.override} ${styles.toggle}`}
          />
        </div>
      );

      if (projectView) {
        for (let i = 0; i < projects.length; i++) {
          declarations = this.getProjectDeclarations(projects[i].id);

          const projectType = getProjectTypeString(
            this.context.configState,
            projects[i].typeCd,
            this.context.configState.config.id
          );

          let sponsorNames = ['None'];
          if (Array.isArray(projects[i].sponsors)) {
            sponsorNames = uniq(projects[i].sponsors.map(sponsor => {
              return sponsor.sponsorName;
            }));
          }
          relationshipNodes.push(
            <Project
              declarations={declarations}
              entities={entities}
              title={projects[i].name}
              type={projectType}
              roleDescription={projects[i].roleDescription}
              sponsorNames={sponsorNames}
              sourceIdentifier={projects[i].sourceIdentifier}
              projectId={projects[i].id}
              declarationTypes={declarationTypes}
              open={this.isProjectDeclarationOpen(projects[i].id)}
              onNext={this.openNext}
              id={i}
              projectCount={projects.length}
              onPrevious={this.openPrevious}
              key={projects[i].id}
            />
          );
        }
      }
      else {
        this.props.entities.filter(entity => {
          return entity.active === 1;
        }).forEach((entity, index) => {
          declarations = this.getEntityDeclarations(entity.id);

          relationshipNodes.push(
            <Entity
              entity={entity}
              declarations={declarations}
              projects={this.props.projects}
              title={entity.name}
              declarationTypes={this.props.declarationTypes}
              open={this.isEntityDeclarationOpen(entity.id)}
              onNext={this.openNext}
              onPrevious={this.openPrevious}
              id={index}
              entityCount={this.props.entities.length}
              key={entity.id}
            />
          );
        });
      }
    }

    const instructionText = config.general.instructions[INSTRUCTION_STEP.PROJECT_DECLARATIONS];
    const contentState = config.general.richTextInstructions ?
      config.general.richTextInstructions[INSTRUCTION_STEP.PROJECT_DECLARATIONS] :
      undefined;
    const instructions = (
      <Instructions
        text={instructionText}
        collapsed={!instructionsShowing[INSTRUCTION_STEP.PROJECT_DECLARATIONS]}
        contentState={contentState}
      />
    );

    return (
      <div className={`${styles.container} ${className}`}>
        {instructions}

        <div className={styles.content}>
          {toggle}
          {skipStepMessage}
          {relationshipNodes}
        </div>
      </div>
    );
  }
}

Relationships.contextTypes = {
  configState: React.PropTypes.object
};
