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

import React from 'react'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import DeclarationSummary from './DeclarationSummary';

export default class extends React.Component {
  getProjectTypeString(typeCd) {
    const theProjectType = this.props.projectTypes.find(projectType => {
      return projectType.typeCd === typeCd;
    });

    if (!theProjectType) {
      return '';
    }

    return theProjectType.description;
  }

  getDeclarationTypeString(typeCd) {
    const theDeclarationType = this.props.declarationTypes.find(declarationType => {
      return declarationType.typeCd === typeCd;
    });

    if (!theDeclarationType) {
      return '';
    }

    return theDeclarationType.description;

  }

  getUniqueProjects(declarations) {
    const projects = [];
    const alreadyAdded = {};

    declarations.forEach(declaration => {
      if (!alreadyAdded[declaration.projectId]) {
        projects.push({
          id: declaration.projectId,
          name: declaration.projectTitle,
          type: this.getProjectTypeString(declaration.projectTypeCd),
          role: declaration.roleCd,
          sponsor: declaration.sponsorName
        });
        alreadyAdded[declaration.projectId] = true;
      }
    });

    projects.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return projects;
  }

  render() {
    const styles = {
      container: {
        backgroundColor: 'white',
        boxShadow: '0 0 8px #AAA',
        borderRadius: 5,
        overflow: 'hidden'
      },
      heading: {
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'black',
        padding: 10
      },
      body: {
        padding: '13px 20px'
      },
      name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 11
      },
      titles: {
        borderBottom: '1px solid #ccc',
        color: window.colorBlindModeOn ? 'black' : '#888',
        fontSize: 12,
        marginBottom: 10
      },
      entityName: {
        width: '25%',
        display: 'inline-block'
      },
      conflict: {
        width: '25%',
        display: 'inline-block'
      },
      comments: {
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      relationship: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottom: '2px solid #666'
      },
      lastrelationship: {
        paddingBottom: 15,
        borderBottom: 0
      },
      label: {
        paddingRight: 5
      },
      field: {
        display: 'inline-block',
        width: '100%',
        padding: '0px 0px 10px 10px'
      }
    };

    let projects = [];
    if(this.props.declarations !== undefined) {

      const uniqueProjects = this.getUniqueProjects(this.props.declarations);

      projects = uniqueProjects.map((project, index) => {
        const declarations = this.props.declarations.filter(declaration => {
          return declaration.projectId === project.id && declaration.finEntityActive === 1;
        }).map(declaration => {
          return (
            <DeclarationSummary
              key={declaration.id}
              declaration={declaration}
              disposition={this.getDeclarationTypeString(declaration.typeCd)}
            />
          );
        });

        return (
          <div key={`proj${project.id}`}
            style={index === uniqueProjects.length - 1 ? styles.lastrelationship : styles.relationship}>
            <div style={styles.name}>{project.name}</div>
            <div style={styles.field}>
              <label style={styles.label}>Project Type:</label>
              <span style={{fontWeight: 'bold'}}>{project.type}</span>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Project Role:</label>
              <span style={{fontWeight: 'bold'}}>{project.role}</span>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Sponsor:</label>
              <span style={{fontWeight: 'bold'}}>{project.sponsor}</span>
            </div>
            <div style={styles.titles}>
              <span style={styles.entityName}>FINANCIAL ENTITY</span>
              <span style={styles.conflict}>REPORTER RELATIONSHIP</span>
              <span style={styles.comments}>REPORTER COMMENTS</span>
            </div>
            {declarations}
          </div>
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>PROJECT DECLARATIONS</div>
        <div style={styles.body}>
          {projects}
        </div>
      </div>
    );
  }
}
