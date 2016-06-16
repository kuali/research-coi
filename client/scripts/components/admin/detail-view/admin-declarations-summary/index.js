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
import { ROLES } from '../../../../../../coi-constants';
import classNames from 'classnames';
import Dropdown from '../../../dropdown';
import {AdminActions} from '../../../../actions/admin-actions';
import PopOver from '../../../pop-over';

export class AdminDeclarationsSummary extends React.Component {
  constructor() {
    super();
    this.getCommentCount = this.getCommentCount.bind(this);
    this.wasRespondedTo = this.wasRespondedTo.bind(this);
    this.onProjectDispositionChanged = this.onProjectDispositionChanged.bind(this);
  }

  onProjectDispositionChanged(dispositionTypeCd, projectPersonId) {
    AdminActions.updateProjectDisposition(
      {
        projectPersonId,
        dispositionTypeCd
      }
    );
  }
  
  onRecommendedDispositionChanged(dispositionTypeCd, projectPersonId) {
    AdminActions.recommendProjectDisposition({
      projectPersonId,
      dispositionTypeCd
    });
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

        let sponsors;
        if (declaration.sponsors && Array.isArray(declaration.sponsors)) {
          sponsors = declaration.sponsors.join(', ');
        }

        projects.push({
          id: declaration.projectId,
          name: declaration.projectTitle,
          type: projectType,
          sourceIdentifier: declaration.sourceIdentifier,
          role: declaration.roleCd,
          sponsors,
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

  getRecommendationFor(projectPersonId) {
    if (this.props.projectRecommendations) {
      const rec = this.props.projectRecommendations.find(recommendation => {
        return recommendation.projectPersonId === projectPersonId;
      });
      if (rec) {
        return rec.disposition;
      }
    }
    
    return -1;
  }

  render() {
    const { declarations, readonly, className } = this.props;

    let projects = [];
    if (this.props.declarations !== undefined) {
      const uniqueProjects = this.getUniqueProjects(declarations);

      let dispositionTypeOptions;
      const { config } = this.context.configState;
      if (
        config.general.dispositionsEnabled &&
        Array.isArray(config.dispositionTypes)
      ) {
        dispositionTypeOptions = config.dispositionTypes
          .filter(type => Boolean(type.active))
          .map(type => {
            return {
              value: type.typeCd,
              label: type.description
            };
          });
      }

      const isAdmin = this.context.userInfo.coiRole === ROLES.ADMIN;
      const isReviewer = this.context.userInfo.coiRole === ROLES.REVIEWER;

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

        if (isAdmin && config.general.dispositionsEnabled) {
          let recommendationLink;
          if (this.props.projectRecommendations) {
            const recommendations = this.props.projectRecommendations.filter(recommendation => {
              return recommendation.projectPersonId === project.projectPersonId;
            }).map(recommendation => {
              const answer = getDispositionTypeString(
                this.context.configState,
                recommendation.disposition,
                this.props.configId
              );
              return (
                <div key={recommendation.usersName}>
                  <span className={styles.userName}>{recommendation.usersName}:</span>
                  <span className={styles.reviewerRecommendation}>{answer}</span>
                </div>
              );
            });

            recommendationLink = (
              <div style={{position: 'relative', fontSize: 12}}>
                <button
                  id={`proj${project.projectPersonId}`}
                  className={styles.reviewerRecommendations}
                >
                  View Reviewer Recommendations
                </button>
                <PopOver triggerId={`proj${project.projectPersonId}`} style={{top: 32}}>
                  {recommendations}
                </PopOver>
              </div>
            );
          }

          if (readonly) {
            let dispositionType = getDispositionTypeString(
              this.context.configState,
              project.dispositionTypeCd,
              this.props.configId
            );
            if (dispositionType === null || dispositionType.length === 0) {
              dispositionType = 'None';
            }
            dispositionTypeSelector = (
              <div className={styles.field}>
                <label className={styles.label}>Project Disposition:</label>
                <span style={{fontWeight: 'bold'}}>
                  {dispositionType}
                </span>
                {recommendationLink}
              </div>
            );
          } else {
            dispositionTypeSelector = (
              <div>
                <label style={{display: 'block'}} htmlFor="disposition">
                  Project Disposition
                </label>

                <Dropdown
                  options={dispositionTypeOptions}
                  id="disposition"
                  value={project.dispositionTypeCd}
                  onChange={this.onProjectDispositionChanged}
                  context={project.projectPersonId}
                />
                {recommendationLink}
              </div>
            );
          }
        } else if (isReviewer &&
          config.general.reviewerDispositionsEnabled &&
          config.general.dispositionsEnabled) {
          if (!readonly) {
            dispositionTypeSelector = (
              <div>
                <label style={{display: 'block'}} htmlFor="disposition">
                  Recommended Project Disposition
                </label>

                <Dropdown
                  options={dispositionTypeOptions}
                  value={this.getRecommendationFor(project.projectPersonId)}
                  onChange={this.onRecommendedDispositionChanged}
                  context={project.projectPersonId}
                />
              </div>
            );
          }
        }

        let commentClass = styles.comment;
        let relationhipLabel;
        if (config.general.dispositionsEnabled) {
          if (isAdmin && config.general.adminRelationshipEnabled) {
            relationhipLabel = (
              <span className={styles.adminRelationship}>ADMIN RELATIONSHIP</span>
            );
            commentClass = classNames(styles.comments, styles.shortComment);
          } else if (isReviewer &&
            config.general.reviewerDispositionsEnabled &&
            config.general.reviewerEntityProjectDispositionsEnabled) {
            relationhipLabel = (
              <span className={styles.adminRelationship}>RECOMMENDED RELATIONSHIP</span>
            );
            commentClass = classNames(styles.comments, styles.shortComment);
          }
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
                  <span style={{fontWeight: 'bold'}}>{project.sponsors}</span>
                </div>
              </div>
              <div style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}>
                {dispositionTypeSelector}
              </div>
            </div>
            <div className={styles.titles}>
              <span className={styles.entityName}>FINANCIAL ENTITY</span>
              <span className={styles.conflict}>REPORTER RELATIONSHIP</span>
              {relationhipLabel}
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
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};
