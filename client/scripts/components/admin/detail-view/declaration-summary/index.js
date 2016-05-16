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
import {DISCLOSURE_STEP, COMMENT_TITLES} from '../../../../../../coi-constants';
import classNames from 'classnames';
import AdminRelationshipSelector from '../admin-relationship-selector';

export default class DeclarationSummary extends React.Component {
  constructor() {
    super();

    this.showComments = this.showComments.bind(this);
  }

  showComments() {
    const { declaration } = this.props;
    AdminActions.showCommentingPanel(
      DISCLOSURE_STEP.PROJECTS,
      declaration.id,
      `${COMMENT_TITLES.DECLARATION} ${declaration.projectTitle} - ${declaration.entityName}`
    );
  }

  render() {
    const { configState } = this.context;
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

    let adminRelationship;
    let commentClass = styles.comments;
    if (get(configState, 'config.general.adminRelationshipEnabled')) {
      if (readonly) {
        adminRelationship = (
          <span className={styles.adminRelationship}>
            {
              getDispositionTypeString(
                configState,
                declaration.adminRelationshipCd,
                configId
              )
            }
          </span>
        );
      } else {
        adminRelationship = (
          <span className={styles.adminRelationship}>
            <AdminRelationshipSelector
              options={options}
              value={declaration.adminRelationshipCd}
              declarationId={declaration.id}
            />
          </span>
        );
      }
      commentClass = classNames(styles.comments, styles.shortComment);
    }

    return (
      <div className={
        classNames(
          styles.container,
          {[styles.highlighted]: changedByPI},
          className
        )}
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
          {adminRelationship}
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
  configState: React.PropTypes.object
};
