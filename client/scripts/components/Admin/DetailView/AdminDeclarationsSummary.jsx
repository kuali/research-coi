import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';

export class AdminDeclarationsSummary extends React.Component {
  constructor() {
    super();
  }

  render() {
    let findEntityName = id => {
      return this.props.names[id];
    };

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
      declaration: {
        fontSize: 12,
        marginBottom: 10
      }
    };

    let relationships = [];
    if(this.props.relationships !== undefined &&
      this.props.relationships.conflicts !== undefined) {
      for (let i = 0; i < this.props.relationships.length; i++) {
        let conflicts = [];
        for (let j = 0; j < this.props.relationships[i].conflicts.length; j++) {
          conflicts.push(
            <div
              key={this.props.relationships[i].conflicts[j].id}
              style={styles.declaration}
            >
              <span style={merge(styles.entityName, {fontWeight: 'bold'})}>
                {findEntityName(this.props.relationships[i].conflicts[j].id)}
              </span>
              <span style={merge(styles.conflict, {fontWeight: 'bold'})}>
                {this.props.relationships[i].conflicts[j].conflict ? 'Conflict' : 'No Conflict'}
              </span>
              <span style={merge(styles.comments, {fontStyle: 'italic'})}>
                {this.props.relationships[i].conflicts[j].comments}
              </span>
            </div>
          );
        }

        let projectName = this.props.relationships[i].name;
        relationships.push(
          <div
            key={projectName}
          stylestyle={i === this.props.relationships.length - 1 ? styles.lastrelationship : styles.relationship}
          >
            <div style={styles.name}>{projectName}</div>
            <div style={styles.titles}>
              <span style={styles.entityName}>FINANCIAL ENTITY</span>
              <span style={styles.conflict}>REPORTER RELATIONSHIP</span>
              <span style={styles.comments}>REPORTER COMMENTS</span>
            </div>
            {conflicts}
          </div>
        );
      }
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
