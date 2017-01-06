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
import { autobind } from 'core-decorators';
import DeclarationSummary from '../declaration-summary';
import {getDispositionTypeString} from '../../../../stores/config-store';
import { ROLES } from '../../../../../../coi-constants';
import classNames from 'classnames';
import Dropdown from '../../../dropdown';
import {AdminActions} from '../../../../actions/admin-actions';
import PopOver from '../../../pop-over';

@autobind
export default class ProjectDeclarationsSummary extends React.Component {
  onSetAllAdminRelationships(dispositionTypeCd) {
    const allDeclarationIds = this.props.declarations.map(d => d.id);
    AdminActions.setAllAdminRelationships([
      allDeclarationIds,
      dispositionTypeCd
    ]);
    document.body.click();
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

  onSetAllRecommendedDispositions(dispositionTypeCd) {
    const allDeclarationIds = this.props.declarations.map(d => d.id);
    AdminActions.setAllRecommendedDispositions([
      allDeclarationIds,
      dispositionTypeCd
    ]);
    document.body.click();
  }

  wasRespondedTo(id) {
    return this.props.piResponses.some(response => {
      return response.targetId === id;
    });
  }

  getCommentCount(id) {
    return this.props.comments.filter(comment => {
      return comment.topicId === id;
    }).length;
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
    const {
      declarations,
      configId,
      readonly,
      dispositionTypeOptions,
      projectRecommendations,
      project,
      last
    } = this.props;

    const declarationSummaries = declarations.map(declaration => {
      return (
        <DeclarationSummary
          key={`decl${declaration.id}`}
          declaration={declaration}
          configId={configId}
          readonly={readonly}
          options={dispositionTypeOptions}
          commentCount={this.getCommentCount(declaration.id)}
          changedByPI={this.wasRespondedTo(declaration.id)}
        />
      );
    });

    let dispositionTypeSelector;

    const isAdmin = this.context.userInfo.coiRole === ROLES.ADMIN;
    const isReviewer = this.context.userInfo.coiRole === ROLES.REVIEWER;

    const { config } = this.context.configState;

    let commentClass = styles.comment;
    let relationshipLabel;

    if (config.general.dispositionsEnabled) {
      if (isAdmin) {
        let recommendationLink;
        if (projectRecommendations) {
          const recommendations = projectRecommendations
            .filter(
              rec => rec.projectPersonId === project.projectPersonId
            ).map(recommendation => {
              const answer = getDispositionTypeString(
                this.context.configState,
                recommendation.disposition,
                configId
              );
              return (
                <div key={recommendation.usersName}>
                  <span className={styles.userName}>
                    {recommendation.usersName}:
                  </span>
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
              <PopOver
                triggerId={`proj${project.projectPersonId}`} style={{top: 32}}
              >
                {recommendations}
              </PopOver>
            </div>
          );
        }

        if (readonly) {
          let dispositionType = getDispositionTypeString(
            this.context.configState,
            project.dispositionTypeCd,
            configId
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

        if (config.general.adminRelationshipEnabled) {
          let setAllButton;
          if (!readonly) {
            setAllButton = (
              <button
                id={`setAll${project.id}`}
                className={styles.setAllLink}
              >
                Set All
              </button>
            );
          }
          relationshipLabel = (
            <span className={styles.adminRelationship}>
              ADMIN RELATIONSHIP
              {setAllButton}
              <PopOver
                triggerId={`setAll${project.id}`}
                style={{top: 32, left: 'calc(80% - 70px)'}}
              >
                <Dropdown
                  options={dispositionTypeOptions}
                  onChange={this.onSetAllAdminRelationships}
                />
              </PopOver>
            </span>
          );
          commentClass = classNames(styles.comments, styles.shortComment);
        }
      } else if (
        isReviewer &&
        config.general.reviewerDispositionsEnabled
      ) {
        if (config.general.reviewerEntityProjectDispositionsEnabled) {
          let setAllButton;
          if (!readonly) {
            setAllButton = (
              <button
                id={`setAll${project.id}`}
                className={styles.setAllLink}
              >
                Set All
              </button>
            );
          }
          relationshipLabel = (
            <span className={styles.adminRelationship}>
              RECOMMENDED RELATIONSHIP
              {setAllButton}
              <PopOver
                triggerId={`setAll${project.id}`}
                style={{top: 32, left: 'calc(80% - 70px)'}}
              >
                <Dropdown
                  options={dispositionTypeOptions}
                  onChange={this.onSetAllRecommendedDispositions}
                />
              </PopOver>
            </span>
          );
          commentClass = classNames(styles.comments, styles.shortComment);
        }

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
    }

    return (
      <div
        key={`proj${project.id}`}
        className={last ? styles.lastrelationship : styles.relationship}
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
              <span style={{fontWeight: 'bold'}}>
                {project.sourceIdentifier}
              </span>
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
          <div
            style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}
          >
            {dispositionTypeSelector}
          </div>
        </div>
        <div className={styles.titles}>
          <span className={styles.entityName}>FINANCIAL ENTITY</span>
          <span className={styles.conflict}>REPORTER RELATIONSHIP</span>
          {relationshipLabel}
          <span className={commentClass}>REPORTER COMMENTS</span>
        </div>
        {declarationSummaries}
      </div>
    );
  }
}

ProjectDeclarationsSummary.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};

ProjectDeclarationsSummary.propTypes = {
  comments: React.PropTypes.array,
  configId: React.PropTypes.number.isRequired,
  declarations: React.PropTypes.array.isRequired,
  dispositionTypeOptions: React.PropTypes.array,
  last: React.PropTypes.bool,
  piResponses: React.PropTypes.array,
  project: React.PropTypes.object.isRequired,
  projectRecommendations: React.PropTypes.array,
  readonly: React.PropTypes.bool
};

ProjectDeclarationsSummary.defaultProps = {
  comments: [],
  declarations: [],
  last: false,
  piResponses: [],
  readonly: false
};
