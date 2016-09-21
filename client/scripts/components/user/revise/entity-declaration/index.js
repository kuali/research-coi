/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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
import React from 'react';
import classNames from 'classnames';
import {formatDate} from '../../../../format-date';
import CheckLink from '../check-link';
import PIReviewActions from '../../../../actions/pi-review-actions';
import {getDeclarationTypeString} from '../../../../stores/config-store';
import { COI_ADMIN, ROLES } from '../../../../../../coi-constants';
import getConfig from '../../../../get-config';

export default class EntityDeclaration extends React.Component {
  constructor(props) {
    super();

    this.state = {
      revising: props.revising ? props.revising : false,
      responding: props.responding ? props.responding : false,
      responded: props.respondedTo,
      revised: props.revised,
      isValid: true
    };

    this.revise = this.revise.bind(this);
    this.respond = this.respond.bind(this);
    this.cancel = this.cancel.bind(this);
    this.done = this.done.bind(this);
  }

  revise() {
    this.setState({
      revising: true
    });
  }

  respond() {
    this.setState({
      responding: true
    });
  }

  cancel() {
    this.setState({
      revising: false,
      responding: false
    });
  }

  done() {
    const newState = {
      revising: false,
      responding: false
    };

    if (this.state.revising) {
      newState.revised = true;
      const radios = document.querySelectorAll(`[name="decType${this.props.entity.id}:${this.props.entity.projectId}"]`);
      let selectedRadio = {};
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          selectedRadio = radios[i];
          break;
        }
      }
      const declarationComment = this.refs.declarationComment ? this.refs.declarationComment : {};
      PIReviewActions.reviseDeclaration(
        this.props.entity.id,
        this.props.entity.projectId,
        selectedRadio.value,
        declarationComment.value
      );
    }
    else if (this.state.responding) {
      const textarea = this.refs.responseText ? this.refs.responseText : { value: ''};
      if (textarea.value.length > 0) {
        newState.responded = true;
        PIReviewActions.respond(this.props.entity.reviewId, textarea.value);
      } else {
        newState.responded = false;
      }
    }

    this.setState(newState);
  }

  render() {
    const {entity, className} = this.props;
    let icon;
    let commentSection;
    if (entity.adminComments.length > 0) {
      const comments = entity.adminComments.map(comment => {
        const commentClasses = classNames(
          {[styles.piComment]: comment.userRole === ROLES.USER},
          styles.comment
        );

        const author = comment.userRole === ROLES.USER ? 'you' : COI_ADMIN;
        return (
          <div className={commentClasses} key={comment.id}>
            <div className={styles.commentTitle}>Comment from
              <span style={{marginLeft: 3}}>{author}</span>:
            </div>
            <div className={styles.commentText}>{comment.text}</div>
            <div className={styles.commentDate}>{formatDate(comment.date)}</div>
          </div>
        );
      });

      if (comments.length > 0) {
        commentSection = (
          <div className={styles.comments}>
            {comments}
          </div>
        );
      }

      if (entity.reviewedOn !== null) {
        icon = (
          <i className={`fa fa-check-circle ${styles.completed}`} />
        );
      }
      else {
        icon = (
          <i className={`fa fa-exclamation-circle ${styles.incomplete}`} />
        );
      }
    }
    else if (entity.relationshipCd == null) { // eslint-disable-line no-eq-null
      icon = (
        <i className={`fa fa-exclamation-circle ${styles.incomplete}`} />
      );
    }

    let actions;
    if (this.state.revising || this.state.responding) {
      actions = (
        <span className={styles.actions}>
          <CheckLink checked={false} onClick={this.cancel}>
            CANCEL
          </CheckLink>
          <CheckLink checked={false} onClick={this.done} disabled={!this.state.isValid}>
            DONE
          </CheckLink>
        </span>
      );
    }
    else {
      let respondLink;
      if (entity.adminComments.length > 0) {
        respondLink = (
          <CheckLink checked={this.state.responded} onClick={this.respond}>
            RESPOND
          </CheckLink>
        );
      }
      actions = (
        <span className={styles.actions}>
          <CheckLink checked={this.state.revised} onClick={this.revise}>
            REVISE
          </CheckLink>
          {respondLink}
        </span>
      );
    }

    let responseText;
    if (this.state.responding) {
      let defaultText;
      if (entity.piResponse) {
        defaultText = entity.piResponse.text;
      }
      responseText = (
        <div>
          <textarea
            aria-label="Response"
            ref="responseText"
            className={styles.responseText}
            defaultValue={defaultText}
          />
        </div>
      );
    }

    let declarationComment;
    if (this.state.revising) {
      declarationComment = (
        <span className={`fill ${styles.declarationComment}`}>
          <textarea className={styles.declarationCommentTextbox} ref="declarationComment" defaultValue={entity.comments} />
        </span>
      );
    }
    else if (entity.comments && entity.comments.length > 0) {
      declarationComment = (
        <span className={`fill ${styles.declarationComment}`}>
          {entity.comments}
        </span>
      );
    }
    else {
      declarationComment = (
        <span className={`fill ${styles.declarationCommentPlaceHolder}`}>
          None
        </span>
      );
    }
    let relationship;
    if (this.state.revising) {
      const config = getConfig(this.context.configState, this.props.configId);
      const declarationTypes = config.declarationTypes.filter(declarationType => {
        return Boolean(declarationType.active);
      }).map(declarationType => {
        return (
          <div key={declarationType.typeCd} className={styles.declarationType}>
            <input
              type="radio"
              id={`decType${entity.id}:${entity.projectId}:${declarationType.typeCd}`}
              name={`decType${entity.id}:${entity.projectId}`}
              defaultChecked={entity.relationshipCd === declarationType.typeCd}
              value={declarationType.typeCd}
            />
            <label
              className={styles.declarationTypeLabel}
              htmlFor={`decType${entity.id}:${entity.projectId}:${declarationType.typeCd}`}
            >
              {declarationType.description}
            </label>
          </div>
        );
      });
      relationship = (
        <span className={styles.relationship}>
          {declarationTypes}
        </span>
      );
    }
    else {
      const declarationType = getDeclarationTypeString(
        this.context.configState,
        entity.relationshipCd,
        this.props.configId
      );

      relationship = (
        <span className={styles.relationship}>{declarationType}</span>
      );
    }

    return (
      <div className={`flexbox row ${styles.container} ${className}`} name='Entity Declaration'>
        <span className={styles.statusIcon}>
          {icon}
        </span>
        <span style={{marginRight: 25}} className={'fill'}>
          <div style={{margin: '8px 0 10px 0'}} className={'flexbox row'}>
            <span className={styles.entityName}>{entity.name}</span>
            {relationship}
            {declarationComment}
          </div>

          {responseText}

          <div>
            {actions}
          </div>
        </span>
        <span className={styles.commentSection}>
          {commentSection}
        </span>
      </div>
    );
  }
}

EntityDeclaration.contextTypes = {
  configState: React.PropTypes.object
};
