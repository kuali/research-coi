import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import DeclarationSummary from './DeclarationSummary';
import ConfigStore from '../../../stores/ConfigStore';

export class AdminDeclarationsSummary extends React.Component {
  constructor() {
    super();
    this.getCommentCount = this.getCommentCount.bind(this);
    this.wasRespondedTo = this.wasRespondedTo.bind(this);
  }

  wasRespondedTo(id) {
    if (this.props.piResponses && Array.isArray(this.props.piResponses)) {
      return this.props.piResponses.some(response => {
        return response.targetId === id;
      });
    }
    else {
      return false;
    }
  }

  getCommentCount(id) {
    return this.props.comments.filter(comment => {
      return comment.topicId === id;
    }).length;
  }

  getUniqueProjects(declarations) {
    let projects = [];
    let alreadyAdded = {};

    declarations.forEach(declaration => {
      if (!alreadyAdded[declaration.projectId]) {
        projects.push({
          id: declaration.projectId,
          name: declaration.projectTitle,
          type: ConfigStore.getProjectTypeString(declaration.projectTypeCd),
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
    let styles = {
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

      let uniqueProjects = this.getUniqueProjects(this.props.declarations);

      projects = uniqueProjects.map((project, index) => {
        let declarations = this.props.declarations.filter(declaration => {
          return declaration.projectId === project.id && declaration.finEntityActive === 1;
        }).map(declaration => {
          return (
            <DeclarationSummary
              key={'decl' + declaration.id}
              declaration={declaration}
              commentCount={this.getCommentCount(declaration.id)}
              changedByPI={this.wasRespondedTo(declaration.id)}
            />
          );
        });

        return (
          <div key={'proj' + project.id}
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
