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
import classNames from 'classnames';
import React from 'react';
import DeclarationSummary from '../DeclarationSummary';

export default class extends React.Component {
  getProjectTypeString(typeCd) {
    const theProjectType = this.props.projectTypes.find(projectType => {
      return projectType.typeCd === typeCd;
    });

    if (!theProjectType) {
      return '';
    }

    return theProjectType.description;
  }

  getDeclarationTypeString(typeCd) {
    const theDeclarationType = this.props.declarationTypes.find(declarationType => {
      return declarationType.typeCd === typeCd;
    });

    if (!theDeclarationType) {
      return '';
    }

    return theDeclarationType.description;

  }

  getUniqueProjects(declarations) {
    const projects = [];
    const alreadyAdded = {};

    declarations.forEach(declaration => {
      if (!alreadyAdded[declaration.projectId]) {
        projects.push({
          id: declaration.projectId,
          name: declaration.projectTitle,
          type: this.getProjectTypeString(declaration.projectTypeCd),
          role: declaration.roleCd,
          sponsor: declaration.sponsorName
        });
        alreadyAdded[declaration.projectId] = true;
      }
    });

    projects.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return projects;
  }

  render() {
    let projects = [];
    if(this.props.declarations !== undefined) {
      const uniqueProjects = this.getUniqueProjects(this.props.declarations);

      projects = uniqueProjects.map((project, index) => {
        const declarations = this.props.declarations.filter(declaration => {
          return declaration.projectId === project.id && declaration.finEntityActive === 1;
        }).map(declaration => {
          return (
            <DeclarationSummary
              key={declaration.id}
              declaration={declaration}
              disposition={this.getDeclarationTypeString(declaration.typeCd)}
            />
          );
        });

        return (
          <div
            key={`proj${project.id}`}
            className={index === uniqueProjects.length - 1 ? styles.lastrelationship : styles.relationship}
          >
            <div className={styles.name}>{project.name}</div>
            <div className={styles.field}>
              <label className={styles.label}>Project Type:</label>
              <span style={{fontWeight: 'bold'}}>{project.type}</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Project Role:</label>
              <span style={{fontWeight: 'bold'}}>{project.role}</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Sponsor:</label>
              <span style={{fontWeight: 'bold'}}>{project.sponsor}</span>
            </div>
            <div className={styles.titles}>
              <span className={styles.entityName}>FINANCIAL ENTITY</span>
              <span className={styles.conflict}>REPORTER RELATIONSHIP</span>
              <span className={styles.comments}>REPORTER COMMENTS</span>
            </div>
            {declarations}
          </div>
        );
      });
    }

    return (
      <div className={classNames(styles.container, this.props.className)} >
        <div className={styles.heading}>PROJECT DECLARATIONS</div>
        <div className={styles.body}>
          {projects}
        </div>
      </div>
    );
  }
}
