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
