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
import DeclarationSummary from '../declaration-summary';
import {
  getProjectTypeString,
  getDispositionTypeString
} from '../../../../stores/config-store';
import ProjectDispositionSelector from '../project-disposition-selector';
import getConfig from '../../../../get-config';
import classNames from 'classnames';

export class AdminDeclarationsSummary extends React.Component {
  constructor() {
    super();
    this.getCommentCount = this.getCommentCount.bind(this);
    this.wasRespondedTo = this.wasRespondedTo.bind(this);
  }

  wasRespondedTo(id) {
    if (this.props.piResponses && Array.isArray(this.props.piResponses)) {
      return this.props.piResponses.some(response => {
        return response.targetId === id;
      });
    }

    return false;
  }

  getCommentCount(id) {
    return this.props.comments.filter(comment => {
      return comment.topicId === id;
    }).length;
  }

  getUniqueProjects(declarations) {
    const projects = [];
    const alreadyAdded = {};

    declarations.forEach(declaration => {
      if (!alreadyAdded[declaration.projectId]) {
        const projectType = getProjectTypeString(
          this.context.configState,
          declaration.projectTypeCd,
          this.context.configState.config.id
        );
        projects.push({
          id: declaration.projectId,
          name: declaration.projectTitle,
          type: projectType,
          sourceIdentifier: declaration.sourceIdentifier,
          role: declaration.roleCd,
          sponsor: declaration.sponsorName,
          dispositionTypeCd: declaration.dispositionTypeCd,
          projectPersonId: declaration.projectPersonId
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
    const { declarations, readonly, className } = this.props;
    const config = getConfig(this.context.configState, this.props.configId);

    let projects = [];
    if(this.props.declarations !== undefined) {
      const uniqueProjects = this.getUniqueProjects(declarations);

      let dispositionTypeOptions;
      if(config.general.dispositionsEnabled && Array.isArray(config.dispositionTypes)) {
        dispositionTypeOptions = config.dispositionTypes
          .filter(type => Boolean(type.active))
          .map(type => {
            return (
              <option key={type.typeCd} value={type.typeCd}>{type.description}</option>
            );
          });
      }

      projects = uniqueProjects.map((project, index) => {
        const declarationSummaries = declarations.filter(declaration => {
          return declaration.projectId === project.id && declaration.finEntityActive === 1;
        }).map(declaration => {
          return (
            <DeclarationSummary
              key={`decl${declaration.id}`}
              declaration={declaration}
              configId={this.props.configId}
              readonly={readonly}
              options={dispositionTypeOptions}
              commentCount={this.getCommentCount(declaration.id)}
              changedByPI={this.wasRespondedTo(declaration.id)}
            />
          );
        });

        let dispositionTypeSelector;
        if (config.general.dispositionsEnabled) {
          if (readonly) {
            const dispositionType = getDispositionTypeString(
              this.context.configState,
              project.dispositionTypeCd,
              this.props.configId
            );
            dispositionTypeSelector = (
              <div className={styles.field}>
                <label className={styles.label}>Project Disposition:</label>
                <span style={{fontWeight: 'bold'}}>
                  {dispositionType}
                </span>
              </div>
            );
          } else {
            dispositionTypeSelector = (
              <ProjectDispositionSelector
                projectPersonId={project.projectPersonId}
                value={project.dispositionTypeCd}
                options={dispositionTypeOptions}
              />
            );
          }
        }

        let commentClass = styles.comment;
        let adminRelationship;
        if (config.general.adminRelationshipEnabled) {
          adminRelationship = (
            <span className={styles.adminRelationship}>ADMIN RELATIONSHIP</span>
          );
          commentClass = classNames(styles.comments, styles.shortComment);
        }

        return (
          <div key={`proj${project.id}`}
            className={index === uniqueProjects.length - 1 ? styles.lastrelationship : styles.relationship}
          >
            <div>
              <div className={styles.name}>{project.name}</div>
              <div style={{display: 'inline-block', width: '50%'}}>
                <div className={styles.field}>
                  <label className={styles.label}>Project Type:</label>
                  <span style={{fontWeight: 'bold'}}>{project.type}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Project Number:</label>
                  <span style={{fontWeight: 'bold'}}>{project.sourceIdentifier}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Project Role:</label>
                  <span style={{fontWeight: 'bold'}}>{project.role}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Sponsor:</label>
                  <span style={{fontWeight: 'bold'}}>{project.sponsor}</span>
                </div>
              </div>
              <div style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}>
                {dispositionTypeSelector}
              </div>
            </div>
            <div className={styles.titles}>
              <span className={styles.entityName}>FINANCIAL ENTITY</span>
              <span className={styles.conflict}>REPORTER RELATIONSHIP</span>
              {adminRelationship}
              <span className={commentClass}>REPORTER COMMENTS</span>
            </div>
            {declarationSummaries}
          </div>
        );
      });
    }

    return (
      <div className={classNames(styles.container, className)} >
        <div className={styles.heading}>PROJECT DECLARATIONS</div>
        <div className={styles.body}>
          {projects}
        </div>
      </div>
    );
  }
}

AdminDeclarationsSummary.contextTypes = {
  configState: React.PropTypes.object
};
