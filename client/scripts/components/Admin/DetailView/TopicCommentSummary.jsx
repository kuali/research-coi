import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';

export default class TopicCommentSummary extends React.Component {
  render() {
    let styles = {
      container: {
        paddingBottom: 25
      },
      topicName: {
        borderBottom: '1px solid white',
        fontSize: 18,
        paddingBottom: 15,
        marginBottom: 15
      },
      comments: {
        paddingLeft: 25,
        color: '#BBB'
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
      }
    };

    let comments;
    if (this.props.comments) {
      comments = this.props.comments.map(comment => {
        return (
          <div key={comment.id}>
            <div>
              <span style={styles.date}>{formatDate(comment.date)}</span>
              <span style={styles.author}>{comment.author}</span>
            </div>
            <div style={styles.text}>
              {comment.text}
            </div>
          </div>
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.topicName}>{this.props.topicName}</div>
        <div style={styles.comments}>
          {comments}
        </div>
      </div>
    );
  }
}
