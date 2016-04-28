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
import ConfigStore from '../../../../stores/config-store';
import {AdminActions} from '../../../../actions/admin-actions';
import {COIConstants} from '../../../../../../coi-constants';
import classNames from 'classnames';
import AdminRelationshipSelector from '../admin-relationship-selector';

export default class DeclarationSummary extends React.Component {
  constructor() {
    super();

    this.showComments = this.showComments.bind(this);
  }

  showComments() {
    AdminActions.showCommentingPanel(
      COIConstants.DISCLOSURE_STEP.PROJECTS,
      this.props.declaration.id,
      `${this.props.declaration.projectTitle} - ${this.props.declaration.entityName}`
    );
  }

  render() {
    let comment;
    if (this.props.declaration.comments) {
      comment = (
        <span>{this.props.declaration.comments}</span>
      );
    }
    else {
      comment = (
        <span className={styles.noComment}>none</span>
      );
    }

    const classes = classNames(
      styles.container,
      {[styles.highlighted]: this.props.changedByPI},
      this.props.className
    );

    let adminRelationship;
    let commentClass = styles.comments;
    if (this.props.config.lane === COIConstants.LANES.TEST && this.props.config.general.adminRelationshipEnabled) {
      if (this.props.readonly) {
        adminRelationship = (
          <span className={styles.adminRelationship}>
            {ConfigStore.getDispositionTypeString(this.props.declaration.adminRelationshipCd)}
          </span>
        );
      } else {
        adminRelationship = (
          <span className={styles.adminRelationship}>
            <AdminRelationshipSelector
              options={this.props.options}
              value={this.props.declaration.adminRelationshipCd}
              declarationId={this.props.declaration.id}
            />
          </span>
        );
      }
      commentClass = classNames(styles.comments, styles.shortComment);
    }

    return (
      <div className={classes}>
        <div>
          <span className={styles.entityName} style={{fontWeight: 'bold'}}>
            {this.props.declaration.entityName}
          </span>
          <span className={styles.conflict} style={{fontWeight: 'bold'}}>
            {ConfigStore.getDeclarationTypeString(this.props.declaration.typeCd)}
          </span>
          {adminRelationship}
          <span className={commentClass} style={{fontStyle: 'italic'}}>
            {comment}
          </span>
        </div>
        <div className={styles.commentLink} onClick={this.showComments}>
          <span className={styles.commentLabel}>COMMENT ({this.props.commentCount})</span>
        </div>
      </div>
    );
  }
}
