import React from 'react/addons';
import {merge} from '../../../merge';
import CommentBubble from './CommentBubble';

export default class TopicCommentSummary extends React.Component {
  render() {
    let styles = {
      container: {
        paddingBottom: 25
      },
      topicName: {
        fontSize: 18,
        marginBottom: 15
      },
      date: {
        float: 'right',
        fontSize: 13
      },
      author: {
        fontWeight: 'bold',
        fontSize: 16
      },
      text: {
        fontSize: 13,
        marginTop: 7,
        marginBottom: 25
      },
      comment: {
        marginBottom: 15
      }
    };

    let comments;
    if (this.props.comments) {
      comments = this.props.comments.map(comment => {
        return (
          <CommentBubble
            key={comment.id}
            isUser={comment.isCurrentUser}
            date={comment.date}
            author={comment.author}
            text={comment.text}
            style={styles.comment}
            new={false}
          />
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.topicName}>{this.props.topicName}</div>
        <div style={{width: '50%', borderBottom: '1px solid black', marginBottom: 15}}></div>
        <div>
          {comments}
        </div>
      </div>
    );
  }
}
