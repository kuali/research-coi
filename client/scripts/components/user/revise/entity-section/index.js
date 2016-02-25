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
import EntityToReview from '../entity-to-review';

export default function EntitySection(props) {
  const entities = props.entitiesToReview.map((entitytoReview, index) => {
    return (
      <EntityToReview
        key={entitytoReview.id}
        entity={entitytoReview}
        respondedTo={entitytoReview.respondedTo}
        revised={entitytoReview.revised}
        className={classNames(
          styles.override,
          styles.entity,
          {[styles.last]: index === props.entitiesToReview.length - 1}
        )}
      />
    );
  });

  return (
    <div className={`${styles.container} ${props.className}`}>
      <div className={styles.title}>
        FINANCIAL ENTITIES
      </div>
      <div className={styles.body}>
        {entities}
      </div>
    </div>
  );
}
