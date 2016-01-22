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
import {Link} from 'react-router';
import AdminMenu from '../../AdminMenu';

export default function Sidebar(props) {
  const steps = [
    {
      label: 'General Configuration',
      link: '/coi/config/general',
      active: true
    },
    {
      label: 'Screening Questionnaire',
      link: '/coi/config/questionnaire'
    },
    {
      label: 'Financial Entities Questionnaire',
      link: '/coi/config/entities'
    },
    {
      label: 'Relationship Matrix',
      link: '/coi/config/relationship'
    },
    {
      label: 'Project Declarations',
      link: '/coi/config/declarations'
    },
    {
      label: 'Customize Certification',
      link: '/coi/config/certification'
    }
  ];

  const stepsJsx = steps.map((step, index) => {
    const parts = step.label.split(' ');
    const rest = parts.pop();
    const firstPart = parts.join(' ');

    const classes = classNames(
      styles.step,
      {[styles.active]: props.active === step.link},
      {[styles.firstStep]: index === 0}
    );

    return (
      <Link key={index} to={step.link} className={classes}>
        <div className={styles.firstWord}>{firstPart}</div>
        <div className={styles.rest}>{rest}</div>
      </Link>
    );
  });

  return (
    <span className={classNames(styles.container, props.className)}>
      <AdminMenu style={{marginBottom: 34, padding: '23px 0px'}} />
      {stepsJsx}
    </span>
  );
}