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
import {isEqual, cloneDeep} from 'lodash';
import {formatDate} from '../../../../format-date';
import CheckLink from '../check-link';
import PIReviewActions from '../../../../actions/pi-review-actions';
import {EntityFormInformationStep} from '../../entities/entity-form-information-step';
import {EntityFormRelationshipStep} from '../../entities/entity-form-relationship-step';
import { COI_ADMIN, ROLES } from '../../../../../../coi-constants';

export default class EntityToReview extends React.Component {
  constructor(props) {
    super();

    this.state = {
      revising: false,
      responding: false,
      responded: props.respondedTo,
      revised: props.revised,
      isValid: true,
      originalEntity: cloneDeep(props.entity)
    };

    delete this.state.originalEntity.revised;
    delete this.state.originalEntity.reviewedOn;
    delete this.state.originalEntity.respondedTo;

    this.revise = this.revise.bind(this);
    this.respond = this.respond.bind(this);
    this.done = this.done.bind(this);
    this.onAnswerQuestion = this.onAnswerQuestion.bind(this);
    this.onAddRelationship = this.onAddRelationship.bind(this);
    this.onRemoveRelationship = this.onRemoveRelationship.bind(this);
    this.addEntityAttachments = this.addEntityAttachments.bind(this);
    this.deleteEntityAttachment = this.deleteEntityAttachment.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
  }

  nameChanged() {
    PIReviewActions.setEntityName(
      this.props.entity.id,
      this.refs.entityName.value
    );
  }

  onRemoveRelationship(relationshipId) {
    PIReviewActions.removeRelationship(this.props.entity.id, relationshipId);
  }

  onAnswerQuestion(newValue, questionId) {
    PIReviewActions.reviseEntityQuestion(
      this.props.entity.id,
      questionId,
      newValue
    );
  }

  onAddRelationship(newRelationship) {
    PIReviewActions.addRelationship(this.props.entity.id, newRelationship);
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

  hasBeenRevised() {
    const clonedEntity = cloneDeep(this.props.entity);
    delete clonedEntity.revised;
    delete clonedEntity.reviewedOn;
    delete clonedEntity.respondedTo;
    return !isEqual(this.state.originalEntity, clonedEntity);
  }

  done() {
    if (!this.state.isValid) {
      return;
    }

    const newState = {
      revising: false,
      responding: false
    };

    if (this.state.revising && this.hasBeenRevised()) {
      newState.revised = true;
      PIReviewActions.sendQueuedEntityQuestionRevisions(this.props.entity.id);
      PIReviewActions.sendQueuedEntityNameChanges(this.props.entity.id);
    }

    if (this.state.responding) {
      const textarea = this.refs.responseText;
      if (textarea.value.length > 0) {
        newState.responded = true;
        PIReviewActions.respond(this.props.entity.reviewId, textarea.value);
      } else {
        newState.responded = false;
      }
    }

    this.setState(newState);
  }

  addEntityAttachments(files, entityId) {
    PIReviewActions.addEntityAttachments(files, entityId);
  }

  deleteEntityAttachment(index, entityId) {
    PIReviewActions.deleteEntityAttachment(index, entityId);
  }

  render() {
    const {entity, className, appState} = this.props;

    let icon;
    let commentSection;
    if (entity.comments) {
      const comments = entity.comments.map(comment => {
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

    let actions;
    if (this.state.revising || this.state.responding) {
      actions = (
        <span className={styles.actions}>
          <CheckLink
            checked={false}
            onClick={this.done}
            disabled={!this.state.isValid}
          >
            DONE
          </CheckLink>
        </span>
      );
    }
    else {
      let respondLink;

      if (entity.comments) {
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

    let entityName;
    if (this.state.revising) {
      entityName = (
        <input
          type="text"
          className={styles.nameTextBox}
          value={entity.name}
          ref="entityName"
          onChange={this.nameChanged}
        />
      );
    }
    else {
      entityName = entity.name;
    }

    let needsAttention;
    if (!entity.answers) {
      needsAttention = (
        <span className={styles.needsAttention}>
          - Needs Attention -
        </span>
      );
    }

    return (
      <div className={`flexbox row ${className}`}>
        <span className={styles.statusIcon}>
          {icon}
        </span>
        <span style={{marginRight: 25}} className={'fill'}>
          <div className={styles.entityName}>
            {entityName}
            {needsAttention}
          </div>
          <div style={{marginBottom: 10}}>
            <EntityFormInformationStep
              id={entity.id}
              readonly={!this.state.revising}
              update={true}
              answers={entity.answers}
              files={entity.files}
              validating={false}
              onAnswerQuestion={this.onAnswerQuestion}
              addEntityAttachments={this.addEntityAttachments}
              deleteEntityAttachment={this.deleteEntityAttachment}
            />
            <EntityFormRelationshipStep
              id={entity.id}
              readonly={!this.state.revising}
              update={true}
              relations={entity.relationships}
              style={{
                borderTop: '1px solid #888',
                marginTop: 16,
                paddingTop: 16
              }}
              validating={false}
              appState={appState}
              onAddRelationship={this.onAddRelationship}
              onRemoveRelationship={this.onRemoveRelationship}
            />
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
