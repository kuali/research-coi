import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import ConfigStore from '../../../stores/ConfigStore';
import {AdminActions} from '../../../actions/AdminActions';

export class AdminDeclarationsSummary extends React.Component {
  constructor() {
    super();
  }

  getUniqueProjects(declarations) {
    let projects = [];
    let alreadyAdded = {};

    declarations.forEach(declaration => {
      if (!alreadyAdded[declaration.projectId]) {
        projects.push({
          id: declaration.projectId,
          name: declaration.projectTitle
        });
        alreadyAdded[declaration.projectId] = true;
      }
    });

    projects.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return projects;
  }

  showComments() {
    AdminActions.showCommentingPanel();
  }

  render() {
    let styles = {
      container: {
        border: '1px solid #999',
        boxShadow: '0 0 10px #BBB',
        borderRadius: 8,
        overflow: 'hidden'
      },
      heading: {
        backgroundColor: '#1481A3',
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
      lastrelationship: {
        paddingBottom: 15,
        borderBottom: 0
      },
      commentLink: {
        fontSize: 14,
        cursor: 'pointer',
        margin: '14px 0 34px 0',
        textAlign: 'right'
      },
      declaration: {
        fontSize: 12,
        marginBottom: 10
      }
    };

    let projects = [];
    if(this.props.declarations !== undefined) {

      let uniqueProjects = this.getUniqueProjects(this.props.declarations);

      projects = uniqueProjects.map((project, index) => {
        let declarations = this.props.declarations.filter(declaration => {
          return declaration.projectId === project.id;
        }).map(declaration => {
          return (
            <div
              key={'decl' + declaration.id}
              style={styles.declaration}
            >
              <div>
                <span style={merge(styles.entityName, {fontWeight: 'bold'})}>
                  {declaration.entityName}
                </span>
                <span style={merge(styles.conflict, {fontWeight: 'bold'})}>
                  {ConfigStore.getDeclarationTypeString(declaration.typeCd)}
                </span>
                <span style={merge(styles.comments, {fontStyle: 'italic'})}>
                  {declaration.comments}
                </span>
              </div>
              <div style={styles.commentLink} onClick={this.showComments}>
                <span style={{borderBottom: '1px dotted black', paddingBottom: 3}}>COMMENTS (999)</span>
              </div>
            </div>
          );
        });

        return (
          <div key={'proj' + project.id}
            style={index === uniqueProjects.length - 1 ? styles.lastrelationship : styles.relationship}>
            <div style={styles.name}>{project.name}</div>
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
