import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class DeclarationsSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        border: '1px solid #999',
        boxShadow: '0 0 15px #E6E6E6',
        backgroundColor: 'white'
      },
      heading: {
        backgroundColor: '#202020',
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'white',
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
        color: '#888',
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
      lastRelationship: {
        paddingBottom: 15,
        borderBottom: 0
      },
      declaration: {
        fontSize: 12,
        marginBottom: 10
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let relationships = [];
    let projects = this.props.projects;
    if(projects !== undefined) {
      projects.forEach((project, index) => {
        let entities = [];
        project.entities.forEach(entity => {
          entities.push(
            <div key={entity.id} style={styles.declaration}>
              <span style={merge(styles.entityName, {fontWeight: 'bold'})}>
                {entity.name}
              </span>
              <span style={merge(styles.conflict, {fontWeight: 'bold'})}>
                {entity.conflict ? 'Conflict' : 'No Conflict'}
              </span>
              <span style={merge(styles.comments, {fontStyle: 'italic'})}>
                {entity.comments}
              </span>
            </div>
          );
        });

        let projectName = project.name;
        let isLastRelationshipInList = index === (projects.length - 1);
        let relationshipStyle = isLastRelationshipInList ? styles.lastRelationship : styles.relationship;
        relationships.push(
          <div key={projectName} style={relationshipStyle}>
            <div style={styles.name}>{projectName}</div>
            <div style={styles.titles}>
              <span style={styles.entityName}>FINANCIAL ENTITY</span>
              <span style={styles.conflict}>REPORTER RELATIONSHIP</span>
              <span style={styles.comments}>REPORTER COMMENTS</span>
            </div>
            {entities}
          </div>
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>PROJECT DECLARATIONS</div>
        <div style={styles.body}>
          {relationships}
        </div>
      </div>
    );
  }
}
