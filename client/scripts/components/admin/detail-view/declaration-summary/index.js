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
import {get} from 'lodash';
import {
  getDispositionTypeString,
  getDeclarationTypeString
} from '../../../../stores/config-store';
import {AdminActions} from '../../../../actions/admin-actions';
import {
  DISCLOSURE_STEP,
  COMMENT_TITLES,
  ROLES
} from '../../../../../../coi-constants';
import classNames from 'classnames';
import Dropdown from '../../../dropdown';
import PopOver from '../../../pop-over';

export default class DeclarationSummary extends React.Component {
  constructor() {
    super();

    this.showComments = this.showComments.bind(this);
    this.onAdminDispositionChanged = this.onAdminDispositionChanged.bind(this);
    this.onReviewerRecommendationChanged = this.onReviewerRecommendationChanged.bind(this);
  }

  showComments() {
    const { declaration } = this.props;
    AdminActions.showCommentingPanel(
      DISCLOSURE_STEP.PROJECTS,
      declaration.id,
      `${COMMENT_TITLES.DECLARATION} ${declaration.projectTitle} - ${declaration.entityName}`
    );
  }

  onAdminDispositionChanged(newValue) {
    AdminActions.updateAdminRelationship(
      {
        declarationId: this.props.declaration.id,
        adminRelationshipCd: newValue
      }
    );
  }

  onReviewerRecommendationChanged(newValue) {
    AdminActions.updateReviewerRelationship(
      {
        declarationId: this.props.declaration.id,
        dispositionCd: newValue
      }
    );
  }

  render() {
    const {
      declaration,
      changedByPI,
      className,
      readonly,
      configId,
      options,
      commentCount
    } = this.props;

    let comment;
    if (declaration.comments) {
      comment = (
        <span>{declaration.comments}</span>
      );
    }
    else {
      comment = (
        <span className={styles.noComment}>none</span>
      );
    }

    let relationship;
    let commentClass = styles.comments;

    const { configState, userInfo } = this.context;

    function getDispositionType(code) {
      return getDispositionTypeString(
        configState,
        code,
        configId
      );
    }

    if (get(configState, 'config.general.dispositionsEnabled')) {
      const isAdmin = userInfo.coiRole === ROLES.ADMIN;
      const isReviewer = userInfo.coiRole === ROLES.REVIEWER;
      if (isAdmin && get(configState, 'config.general.adminRelationshipEnabled')) {
        let recommendationLink;
        if (declaration.recommendations && declaration.recommendations.length > 0) {
          const recommendations = declaration.recommendations.map(recommendation => {
            const answer = getDispositionType(recommendation.dispositionTypeCd);
            return (
              <div key={recommendation.usersName}>
                <span className={styles.userName}>{recommendation.usersName}:</span>
                <span className={styles.reviewerRecommendation}>{answer}</span>
              </div>
            );
          });

          const linkId = `recmndLnk${declaration.id}`;
          recommendationLink = (
            <div style={{position: 'relative'}}>
              <button
                id={linkId}
                className={styles.reviewerRecommendations}
              >
                View Reviewer Recommendations
              </button>
              <PopOver triggerId={linkId} style={{top: 32}}>
                {recommendations}
              </PopOver>
            </div>
          );
        }

        if (readonly) {
          relationship = (
            <span className={styles.disposition}>
              {getDispositionType(declaration.adminRelationshipCd)}
              {recommendationLink}
            </span>
          );
        } else {
          relationship = (
            <span className={styles.disposition}>
              <div>
                <Dropdown
                  options={options}
                  className={styles.select}
                  id="adminRelationship"
                  value={declaration.adminRelationshipCd}
                  onChange={this.onAdminDispositionChanged}
                />
              </div>
              {recommendationLink}
            </span>
          );
        }

        commentClass = classNames(styles.comments, styles.shortComment);
      } else if (isReviewer &&
        get(configState, 'config.general.reviewerDispositionsEnabled') &&
        get(configState, 'config.general.reviewerEntityProjectDispositionsEnabled')) {
        if (readonly) {
          relationship = (
            <span className={styles.disposition}>
              {getDispositionType(declaration.reviewerRelationshipCd)}
            </span>
          );
        } else {
          relationship = (
            <span className={styles.disposition}>
              <div>
                <Dropdown
                  options={options}
                  className={styles.select}
                  id="reviewerRelationship"
                  value={declaration.reviewerRelationshipCd}
                  onChange={this.onReviewerRecommendationChanged}
                />
              </div>
            </span>
          );
        }
        commentClass = classNames(styles.comments, styles.shortComment);
      }
    }

    return (
      <div
        className={
          classNames(
            styles.container,
            {[styles.highlighted]: changedByPI},
            className
          )
        }
      >
        <div>
          <span className={styles.entityName} style={{fontWeight: 'bold'}}>
            {declaration.entityName}
          </span>
          <span className={styles.conflict} style={{fontWeight: 'bold'}}>
            {
              getDeclarationTypeString(
                configState,
                declaration.typeCd,
                configId
              )
            }
          </span>
          {relationship}
          <span className={commentClass} style={{fontStyle: 'italic'}}>
            {comment}
          </span>
        </div>
        <div className={styles.commentLink} onClick={this.showComments}>
          <span className={styles.commentLabel}>COMMENT ({commentCount})</span>
        </div>
      </div>
    );
  }
}

DeclarationSummary.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};
