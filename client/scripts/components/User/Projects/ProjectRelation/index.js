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
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class ProjectRelation extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.relationChosen = this.relationChosen.bind(this);
    this.commentMade = this.commentMade.bind(this);
  }

  relationChosen(evt) {
    DisclosureActions.entityRelationChosen('PROJECT', this.props.finEntityId, this.props.project.id, parseInt(evt.target.value));
  }

  commentMade() {
    DisclosureActions.declarationCommentedOn('PROJECT', this.props.finEntityId, this.props.project.id, this.refs.comment.value);
  }

  renderMobile() {}

  renderDesktop() {
    const desktopStyles = {
      container: {
        padding: '10px 0 3px 0',
        borderTop: '1px solid #C3C3C3',
        fontSize: 15
      },
      commentBox: {
        height: 35,
        padding: 5,
        border: '1px solid #8D8D8D',
        fontSize: 15,
        borderRadius: 5,
        width: '90%'
      }
    };
    const styles = merge(this.commonStyles, desktopStyles);

    const declarationTypeOptions = this.props.declarationTypes.map(type => {
      return (
      <div key={type.typeCd}>
        <input
          type="radio"
          ref="none"
          checked={this.props.typeCd === type.typeCd}
          value={type.typeCd}
          onChange={this.relationChosen}
          name={`${this.props.project.id}relation${this.props.finEntityId}`}
          id={`${this.props.project.id}r${this.props.finEntityId}${type.typeCd}`}
        />
        <label
          htmlFor={`${this.props.project.id}r${this.props.finEntityId}${type.typeCd}`}
          style={{fontSize: 14, marginLeft: 6}}
        >
          {type.description}
        </label>
      </div>
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={{width: '25%', display: 'inline-block', verticalAlign: 'top'}}>
          {this.props.project.name}
        </span>
        <span style={{width: '30%', display: 'inline-block', verticalAlign: 'top'}}>
          {declarationTypeOptions}
        </span>
        <span style={{width: '45%', display: 'inline-block'}}>
          <input
            type="text"
            ref="comment"
            value={this.props.comments}
            onChange={this.commentMade}
            style={styles.commentBox}
            aria-label={`Report comments for ${this.props.project.name}`}
          />
        </span>
      </div>
    );
  }
}
