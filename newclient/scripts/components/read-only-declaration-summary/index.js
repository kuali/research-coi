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
import classNames from 'classnames';
import React from 'react';
import {getDispositionTypeString} from '../../stores/config-store';
import getConfig from '../../get-config';
import RecommendationLink from '../recommendation-link';

export default function DeclarationSummary(props, {configState}) {
  const {configId, showDispositions, declaration, className, disposition, displayRecommendation} = props;
  const config = getConfig(configState, configId);
  if (config === null) {
    return null;
  }

  let adminRelationship;
  let commentClass = styles.comments;
  if (config.general.adminRelationshipEnabled && showDispositions) {
    const dispositionType = getDispositionTypeString(
      configState,
      declaration.adminRelationshipCd,
      configId
    );

    let recommendationLink;
    if (declaration.recommendations && displayRecommendation) {
      const recommendations = declaration.recommendations.map(decl => {
        return Object.assign(decl, {
          disposition: decl.dispositionTypeCd
        });
      });

      recommendationLink = (
        <div>
          <RecommendationLink
            recommendations={recommendations}
            configId={configId}
          />
        </div>
      );
    }

    adminRelationship = (
      <span className={styles.adminRelationship}>
        <div>{dispositionType}</div>
        {recommendationLink}
      </span>
    );
    commentClass = classNames(styles.comments, styles.shortComment);
  }

  let commentsJsx;
  if (props.comments && props.comments.length > 0) {
    const individualComments = props.comments.map(comment => {
      return (
        <div key={comment.id} className={styles.comment}>
          {comment.author}:
          <span className={styles.commentText}>{comment.text}</span>
        </div>
      );
    });

    commentsJsx = (
      <div className={styles.commentSection}>
        <div className={styles.commentsLabel}>COMMENTS:</div>
        {individualComments}
      </div>
    );
  }

  return (
    <div className={classNames(styles.container, className)}>
      <div>
        <span className={styles.entityName} style={{fontWeight: 'bold'}}>
          {declaration.entityName}
        </span>
        <span className={styles.conflict} style={{fontWeight: 'bold'}}>
          {disposition}
        </span>
        {adminRelationship}
        <span className={commentClass} style={{fontStyle: 'italic'}}>
          {declaration.comments}
        </span>
      </div>
      {commentsJsx}
    </div>
  );
}

DeclarationSummary.contextTypes = {
  configState: React.PropTypes.object
};
