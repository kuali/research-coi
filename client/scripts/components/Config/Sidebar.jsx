/* @flow */
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

import React from 'react';
import {merge} from '../../merge';
import {Link} from 'react-router';
import AdminMenu from '../AdminMenu';

export default function Sidebar(props: Object): React.Element {
  const styles = {
    container: {
      color: '#444',
      backgroundColor: '#F2F2F2',
      display: 'inline-block',
      minWidth: 300
    },
    firstWord: {
      fontSize: 28,
      fontWeight: 300
    },
    rest: {
      fontSize: 22,
      fontWeight: 'bold'
    },
    step: {
      padding: '20px 20px 20px 40px',
      display: 'block',
      borderRight: '1px solid #c0c0c0',
      borderBottom: '1px solid #c0c0c0',
      cursor: 'pointer',
      color: '#666666'
    },
    firstStep: {
      borderTop: '1px solid #c0c0c0'
    },
    active: {
      backgroundColor: 'white',
      borderRight: window.colorBlindModeOn ? '5px solid black' : '5px solid #0095A0'
    }
  };

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

    let stepStyle = styles.step;
    if (props.active === step.link) {
      stepStyle = merge(stepStyle, styles.active);
    }
    else if (index === 0) {
      stepStyle = merge(stepStyle, styles.firstStep);
    }
    return (
      <Link key={index} to={step.link} style={stepStyle}>
        <div style={styles.firstWord}>{firstPart}</div>
        <div style={styles.rest}>{rest}</div>
      </Link>
    );
  });

  return (
    <span style={merge(styles.container, props.style)}>
      <AdminMenu style={{marginBottom: 34, padding: '23px 0px'}} />
      {stepsJsx}
    </span>
  );
}
