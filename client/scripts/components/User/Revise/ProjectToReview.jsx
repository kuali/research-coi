import React from 'react/addons';
import {merge} from '../../../merge';
import EntityDeclaration from './EntityDeclaration';

export default class ProjectToReview extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        paddingBottom: 10
      },
      projectTitle: {
        fontSize: 20,
        margin: '20px 0 20px 45px'
      },
      headings: {
        borderBottom: '1px solid #CCC',
        marginLeft: 45,
        marginRight: 35,
        paddingBottom: 4
      },
      entityName: {
        display: 'inline-block',
        width: 250,
        fontSize: 14
      },
      relationship: {
        display: 'inline-block',
        width: 230,
        fontSize: 14
      },
      comment: {
        display: 'inline-block',
        fontSize: 14
      },
      commentFiller: {
        width: 300
      },
      borderArea: {
        borderBottom: '1px solid #333',
        margin: '30px 0 0 50px'
      }
    };

    let entityDeclarations;
    if (this.props.project.entities) {
      entityDeclarations = this.props.project.entities.map(entityDeclaration => {
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
    if (!this.props.last) {
      bottomBorder = (
        <div className="flexbox row">
          <span className="fill" style={styles.borderArea}></span>
          <span style={styles.commentFiller}></span>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.projectTitle}>{this.props.project.name}</div>
        <div className="flexbox row">
          <span className="fill" style={styles.headings}>
            <span style={styles.entityName}>FINANCIAL ENTITY</span>
            <span style={styles.relationship}>REPORTER RELATIONSHIP</span>
            <span style={styles.comment}>REPORTER COMMENTS</span>
          </span>
          <span style={styles.commentFiller}></span>
        </div>
        {entityDeclarations}

        {bottomBorder}
      </div>
    );
  }
}
