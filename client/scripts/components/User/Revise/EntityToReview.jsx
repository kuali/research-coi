import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import CheckLink from './CheckLink';
import PIReviewActions from '../../../actions/PIReviewActions';
import {EntityFormInformationStep} from '../Entities/EntityFormInformationStep';
// import {EntityFormRelationshipStep} from '../Entities/EntityFormRelationshipStep';

export default class EntityToReview extends React.Component {
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
    this.onAnswerQuestion = this.onAnswerQuestion.bind(this);
  }

  onAnswerQuestion(newValue, questionId) {
    PIReviewActions.reviseEntityQuestion(this.props.entity.reviewId, questionId, newValue);
    this.setState({
      revised: true
    });
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
        marginBottom: 40
      },
      statusIcon: {
        width: 45
      },
      comments: {
        width: 300,
        backgroundColor: '#EEE',
        borderRadius: 5
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
      comment: {
        margin: '11px 15px'
      },
      completed: {
        color: 'green',
        fontSize: 35
      },
      incomplete: {
        color: '#E85723',
        fontSize: 35
      },
      entityName: {
        fontSize: 25
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
      }
    };

    let comments = this.props.entity.comments.map(comment => {
      return (
        <div style={styles.comment} key={comment.id}>
          <div style={styles.commentTitle}>Comment from {comment.author}:</div>
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
          <textarea ref="responseText" style={styles.responseText} defaultValue={defaultText} />
        </div>
      );
    }

    return (
      <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={styles.statusIcon}>
          {icon}
        </span>
        <span style={{marginRight: 25}} className="fill">
          <div style={styles.entityName}>{this.props.entity.name}</div>
          <div style={{marginBottom: 10}}>
            <EntityFormInformationStep
              id={this.props.entity.id}
              readonly={!this.state.revising}
              update={true}
              answers={this.props.entity.answers}
              files={[]}
              validating={false}
              onAnswerQuestion={this.onAnswerQuestion}
            />
            {/*<EntityFormRelationshipStep
              id={1}
              readonly={false}
              update={true}
              relations={[]}
              name={'Barnicles!'}
              style={{borderTop: '1px solid #888', marginTop: 16, paddingTop: 16}}
              validating={false}
              appState={this.props.appState}
            />*/}
          </div>
          {responseText}
          <div>
            {actions}
          </div>
        </span>
        <span style={styles.comments}>
          {comments}
        </span>
      </div>
    );
  }
}
