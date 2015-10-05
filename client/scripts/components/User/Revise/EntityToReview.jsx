import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import CheckLink from './CheckLink';

export default class EntityToReview extends React.Component {
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
      }
    };

    let comments = this.props.comments.map(comment => {
      return (
        <div style={styles.comment} key={comment.id}>
          <div style={styles.commentTitle}>Comment from {comment.author}:</div>
          <div style={styles.commentText}>{comment.text}</div>
          <div style={styles.commentDate}>{formatDate(comment.date)}</div>
        </div>
      );
    });

    let icon;
    if (this.props.completed) {
      icon = (
        <i className="fa fa-check-circle" style={styles.completed}></i>
      );
    }
    else {
      icon = (
        <i className="fa fa-exclamation-circle" style={styles.incomplete}></i>
      );
    }

    return (
      <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={styles.statusIcon}>
          {icon}
        </span>
        <span style={{marginRight: 25}} className="fill">
          <div style={{marginBottom: 10}}>
            The entity goes here
          </div>
          <div>
            <span style={{display: 'inline-block', float: 'right'}}>
              <CheckLink checked={true}>REVISE</CheckLink>
              <CheckLink checked={false}>RESPOND</CheckLink>
            </span>
          </div>
        </span>
        <span style={styles.comments}>
          {comments}
        </span>
      </div>
    );
  }
}
