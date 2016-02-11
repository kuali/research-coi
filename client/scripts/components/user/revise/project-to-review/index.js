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
import EntityDeclaration from '../entity-declaration';

export default function ProjectToReview(props) {
  let entityDeclarations;
  if (props.project.entities) {
    entityDeclarations = props.project.entities.map(entityDeclaration => {
      return (
        <EntityDeclaration
          key={entityDeclaration.id}
          entity={entityDeclaration}
          revised={entityDeclaration.revised}
          respondedTo={entityDeclaration.respondedTo}
        />
      );
    });
  }

  let bottomBorder;
  if (!props.last) {
    bottomBorder = (
      <div className={`flexbox row`}>
        <span className={`fill ${styles.borderArea}`}></span>
        <span className={styles.commentFiller}></span>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${props.className}`}>
      <div className={styles.projectTitle}>{props.project.name}</div>
      <div className={`flexbox row`}>
        <span className={`fill ${styles.headings}`}>
          <span className={styles.entityName}>FINANCIAL ENTITY</span>
          <span className={styles.relationship}>REPORTER RELATIONSHIP</span>
          <span className={styles.comment}>REPORTER COMMENTS</span>
        </span>
        <span className={styles.commentFiller}></span>
      </div>
      {entityDeclarations}

      {bottomBorder}
    </div>
  );
}
