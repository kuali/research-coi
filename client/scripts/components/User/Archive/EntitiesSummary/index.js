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
import classNames from 'classnames';
import React from 'react';
import EntitySummary from '../EntitySummary';

export default function EntitiesSummary(props) {
  let entities;
  if(props.entities !== undefined) {
    entities = props.entities.filter(entity => {
      return entity.active;
    }).map((entity, index, array) => {
      return (
        <EntitySummary
          key={entity.id}
          isLast={index === array.length - 1}
          questions={props.questions}
          entity={entity}
        />
      );
    });
  }

  return (
    <div className={classNames(styles.container, props.className)} >
      <div className={styles.heading}>FINANCIAL ENTITIES</div>
      <div className={styles.body}>
        {entities}
      </div>
    </div>
  );
}
