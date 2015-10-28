import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import CheckLink from './CheckLink';
import PIReviewActions from '../../../actions/PIReviewActions';
import ConfigStore from '../../../stores/ConfigStore';

export default class EntityDeclaration extends React.Component {
  constructor(props) {
    super();

    this.state = {
      revising: false,
      responding: false,
      responded: props.respondedTo !== null,
      revised: props.revised !== null,
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
    let newState = {
      revising: false,
      responding: false
    };

    if (this.state.revising) {
      newState.revised = true;
      let radios = document.querySelectorAll(`[name="decType${this.props.entity.id}:${this.props.entity.projectId}"]`);
      let selectedRadio;
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          selectedRadio = radios[i];
          break;
        }
      }
      let declarationComment = React.findDOMNode(this.refs.declarationComment);
      PIReviewActions.reviseDeclaration(this.props.entity.reviewId, selectedRadio.value, declarationComment.value);
    }
    else if (this.state.responding) {
      newState.responded = true;
      let textarea = React.findDOMNode(this.refs.responseText);
      PIReviewActions.respond(this.props.entity.reviewId, textarea.value);
    }

    this.setState(newState);
  }

  render() {
    let styles = {
      container: {
        margin: '17px 17px 17px 0'
      },
      statusIcon: {
        width: 45
      },
      commentTitle: {
        fontWeight: 'bold',
        fontSize: 15
      },
      commentDate: {
        fontStyle: 'italic',
        fontSize: 12,
        paddingTop: 2
      },
      commentText: {
        fontSize: 14
      },
      commentSection: {
        width: 300
      },
      comments: {
        backgroundColor: window.colorBlindModeOn ? 'black' : '#D8E9EB',
        color: window.colorBlindModeOn ? 'white' : 'black',
        borderRadius: 5,
        padding: '1px 10px'
      },
      comment: {
        margin: '15px 10px'
      },
      completed: {
        color: window.colorBlindModeOn ? 'black' : 'green',
        fontSize: 35
      },
      incomplete: {
        color: window.colorBlindModeOn ? 'black' : '#E85723',
        fontSize: 35
      },
      actions: {
        display: 'inline-block',
        float: 'right'
      },
      responseText: {
        width: '100%',
        height: 120,
        borderRadius: 5,
        border: '1px solid #AAA',
        margin: '10px 0',
        fontSize: 16,
        padding: '6px 8px',
        resize: 'none',
        backgroundColor: '#EEEEEE'
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
      declarationComment: {
        display: 'inline-block',
        fontSize: 14
      },
      declarationCommentPlaceHolder: {
        fontStyle: 'italic',
        color: '#CCC',
        display: 'inline-block',
        fontSize: 14
      },
      declarationCommentTextbox: {
        width: '100%',
        padding: '5px 8px',
        fontSize: 14,
        border: '1px solid #999',
        height: 100,
        borderRadius: 5,
        resize: 'none'
      },
      declarationTypeLabel: {
        paddingLeft: 5
      },
      declarationType: {
        padding: '3px 0'
      }
    };

    let comments = this.props.entity.adminComments.map(comment => {
      return (
        <div style={styles.comment} key={comment.id}>
          <div style={styles.commentTitle}>Comment from
            <span style={{marginLeft: 3}}>{comment.author}</span>:
          </div>
          <div style={styles.commentText}>{comment.text}</div>
          <div style={styles.commentDate}>{formatDate(comment.date)}</div>
        </div>
      );
    });

    let icon;
    if (this.props.entity.reviewedOn !== null) {
      icon = (
        <i className="fa fa-check-circle" style={styles.completed}></i>
      );
    }
    else {
      icon = (
        <i className="fa fa-exclamation-circle" style={styles.incomplete}></i>
      );
    }

    let actions;
    if (this.state.revising || this.state.responding) {
      actions = (
        <span style={styles.actions}>
          <CheckLink checked={false} onClick={this.cancel}>CANCEL</CheckLink>
          <CheckLink checked={false} onClick={this.done} disabled={!this.state.isValid}>DONE</CheckLink>
        </span>
      );
    }
    else {
      actions = (
        <span style={styles.actions}>
          <CheckLink checked={this.state.revised} onClick={this.revise}>REVISE</CheckLink>
          <CheckLink checked={this.state.responded} onClick={this.respond}>RESPOND</CheckLink>
        </span>
      );
    }

    let responseText;
    if (this.state.responding) {
      let defaultText;
      if (this.props.entity.piResponse) {
        defaultText = this.props.entity.piResponse.text;
      }
      responseText = (
        <div>
          <textarea aria-label="Response" ref="responseText" style={styles.responseText} defaultValue={defaultText} />
        </div>
      );
    }

    let declarationComment;
    if (this.state.revising) {
      declarationComment = (
        <span style={styles.declarationComment} className="fill">
          <textarea style={styles.declarationCommentTextbox} ref="declarationComment" defaultValue={this.props.entity.comments} />
        </span>
      );
    }
    else {
      if (this.props.entity.comments && this.props.entity.comments.length > 0) {
        declarationComment = (
          <span style={styles.declarationComment} className="fill">
            {this.props.entity.comments}
          </span>
        );
      }
      else {
        declarationComment = (
          <span style={styles.declarationCommentPlaceHolder} className="fill">
            None
          </span>
        );
      }
    }

    let relationship;
    if (this.state.revising) {
      let declarationTypes = window.config.declarationTypes.filter(declarationType => {
        return !!declarationType.enabled && !!declarationType.active;
      }).map(declarationType => {
        return (
          <div key={declarationType.typeCd} style={styles.declarationType}>
            <input
              type="radio"
              id={`decType${this.props.entity.id}:${this.props.entity.projectId}:${declarationType.typeCd}`}
              name={`decType${this.props.entity.id}:${this.props.entity.projectId}`}
              defaultChecked={this.props.entity.relationshipCd === declarationType.typeCd}
              value={declarationType.typeCd}
            />
            <label
              style={styles.declarationTypeLabel}
              htmlFor={`decType${this.props.entity.id}:${this.props.entity.projectId}:${declarationType.typeCd}`}
            >
              {declarationType.description}
            </label>
          </div>
        );
      });
      relationship = (
        <span style={styles.relationship}>
          {declarationTypes}
        </span>
      );
    }
    else {
      relationship = (
        <span style={styles.relationship}>
          {ConfigStore.getDeclarationTypeString(this.props.entity.relationshipCd)}
        </span>
      );
    }

    return (
      <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={styles.statusIcon}>
          {icon}
        </span>
        <span style={{marginRight: 25}} className="fill">
          <div style={{margin: '8px 0 10px 0'}} className="flexbox row">
            <span style={styles.entityName}>{this.props.entity.name}</span>
            {relationship}
            {declarationComment}
          </div>

          {responseText}

          <div>
            {actions}
          </div>
        </span>
        <span style={styles.commentSection}>
          <div style={styles.comments}>
            {comments}
          </div>
        </span>
      </div>
    );
  }
}
