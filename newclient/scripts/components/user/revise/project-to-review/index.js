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
import EntityDeclaration from '../entity-declaration';

export default function ProjectToReview({
  project,
  last,
  configId,
  className,
  necessaryEntities
}) {
  let entityDeclarations;
  if (project.entities) {
    entityDeclarations = project.entities.map(entityDeclaration => {
      return (
        <EntityDeclaration
          key={entityDeclaration.id}
          entity={entityDeclaration}
          revised={entityDeclaration.revised}
          respondedTo={entityDeclaration.respondedTo}
          configId={configId}
        />
      );
    });
  }

  let bottomBorder;
  if (!last) {
    bottomBorder = (
      <div className={'flexbox row'}>
        <span className={`fill ${styles.borderArea}`} />
        <span className={styles.commentFiller} />
      </div>
    );
  }

  let undeclaredEntities;
  if (necessaryEntities.length !== project.entities.length) {
    undeclaredEntities = necessaryEntities.filter(necessaryEntity => {
      return !project.entities.some(projectEntity => {
        return projectEntity.id === necessaryEntity.id;
      });
    }).map(entity => {
      entity.adminComments = [];
      entity.projectId = project.id;
      return (
        <EntityDeclaration
          key={entity.id}
          entity={entity}
          revised={false}
          respondedTo={false}
          configId={configId}
        />
      );
    });
  }
  
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.projectTitle}>
        <span className={styles.titleSegment}>{project.sourceIdentifier}</span>
        <span className={styles.titleSegment}>-</span>
        <span className={styles.titleSegment}>{project.projectType}</span>
        <span className={styles.titleSegment}>({project.name})</span>
      </div>
      <div className={'flexbox row'}>
        <span className={`fill ${styles.headings}`}>
          <span className={styles.entityName}>FINANCIAL ENTITY</span>
          <span className={styles.relationship}>REPORTER RELATIONSHIP</span>
          <span className={styles.comment}>REPORTER COMMENTS</span>
        </span>
        <span className={styles.commentFiller} />
      </div>
      {entityDeclarations}
      {undeclaredEntities}
      {bottomBorder}
    </div>
  );
}

ProjectToReview.propTypes = {
  project: React.PropTypes.object.isRequired,
  last: React.PropTypes.bool,
  configId: React.PropTypes.number.isRequired,
  className: React.PropTypes.string,
  necessaryEntities: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

ProjectToReview.defaultProps = {
  last: false
};
