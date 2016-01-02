/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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
import {DisclosureActions} from '../../../../actions/DisclosureActions';
import {Project} from '../Project';
import {Entity} from '../Entity';
import {Toggle} from '../../Toggle';
import {Instructions} from '../../Instructions';
import {COIConstants} from '../../../../../../COIConstants';
import ConfigStore from '../../../../stores/ConfigStore';

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
    const projectView = this.props.view === 0;
    const relationshipNodes = [];
    let declarations;
    if (projectView) {
      for (let i = 0; i < this.props.projects.length; i++) {
        declarations = this.getProjectDeclarations(this.props.projects[i].id);

        relationshipNodes.push(
          <Project
            declarations={declarations}
            entities={this.props.entities}
            title={this.props.projects[i].name}
            type={ConfigStore.getProjectTypeString(this.props.projects[i].typeCd)}
            role={this.props.projects[i].roleCd}
            sponsor={this.props.projects[i].sponsorName}
            projectId={this.props.projects[i].id}
            declarationTypes={this.props.declarationTypes}
            open={this.isProjectDeclarationOpen(this.props.projects[i].id)}
            onNext={this.openNext}
            id={i}
            projectCount={this.props.projects.length}
            onPrevious={this.openPrevious}
            key={this.props.projects[i].id}
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

    const instructionText = window.config.general.instructions[COIConstants.INSTRUCTION_STEP.PROJECT_DECLARATIONS];
    const instructions = (
      <Instructions
        text={instructionText}
        collapsed={!this.props.instructionsShowing}
      />
    );

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        {instructions}

        <div className={styles.content}>
          <div style={{textAlign: 'right'}}>
            <Toggle
              values={[{code: 0, description: 'Project View'}, {code: 1, description: 'SFI View'}]}
              selected={this.props.view}
              onChange={this.viewChanged}
              className={`${styles.override} ${styles.toggle}`}
            />
          </div>

          {relationshipNodes}
        </div>
      </div>
    );
  }
}
