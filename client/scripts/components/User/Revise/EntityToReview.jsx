import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import CheckLink from './CheckLink';
import PIReviewActions from '../../../actions/PIReviewActions';
import {EntityFormInformationStep} from '../Entities/EntityFormInformationStep';
import {EntityFormRelationshipStep} from '../Entities/EntityFormRelationshipStep';
import {DisclosureStore} from '../../../stores/DisclosureStore';

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
    this.onAddRelationship = this.onAddRelationship.bind(this);
    this.onRemoveRelationship = this.onRemoveRelationship.bind(this);

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    this.onChange();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = DisclosureStore.getState();
    this.setState({
      appState: storeState.applicationState
    });
  }

  onRemoveRelationship(relationshipId) {
    PIReviewActions.removeRelationship(this.props.entity.id, this.props.entity.reviewId, relationshipId);
  }

  onAnswerQuestion(newValue, questionId) {
    PIReviewActions.reviseEntityQuestion(this.props.entity.reviewId, questionId, newValue);
    this.setState({
      revised: true
    });
  }

  onAddRelationship(newRelationship) {
    PIReviewActions.addRelationship(this.props.entity.reviewId, newRelationship);
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
    if (!this.state.isValid) {
      return;
    }

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
          {/*<CheckLink checked={false} onClick={this.cancel}>CANCEL</CheckLink>*/}
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
            <EntityFormRelationshipStep
              id={this.props.entity.id}
              readonly={!this.state.revising}
              update={true}
              relations={this.props.entity.relationships}
              style={{borderTop: '1px solid #888', marginTop: 16, paddingTop: 16}}
              validating={false}
              appState={this.state.appState}
              onAddRelationship={this.onAddRelationship}
              onRemoveRelationship={this.onRemoveRelationship}
            />
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
