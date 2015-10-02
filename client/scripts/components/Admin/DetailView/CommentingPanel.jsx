import React from 'react/addons';
import {merge} from '../../../merge';
import CommentBubble from './CommentBubble';
import {AdminActions} from '../../../actions/AdminActions';
import {KButton} from '../../KButton';

export default class CommentingPanel extends React.Component {
  constructor() {
    super();

    this.makeComment = this.makeComment.bind(this);
  }

  done() {
    AdminActions.hideCommentingPanel();
  }

  makeComment() {
    let piCheck = React.findDOMNode(this.refs.piCheck);
    let visibleToPI = piCheck.checked;
    piCheck.checked = false;
    let textarea = React.findDOMNode(this.refs.commentText);
    let commentText = textarea.value;
    textarea.value = '';

    AdminActions.makeComment(
      this.props.disclosureId,
      this.props.topicSection,
      this.props.topicId,
      visibleToPI,
      false,
      commentText
    );

  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'black',
        height: '100%'
      },
      heading: {
        color: 'white',
        padding: '10px 20px',
        marginBottom: 20,
        boxShadow: '22px 50px 100px black',
        zIndex: 99,
        position: 'relative',
        backgroundColor: 'black'
      },
      close: {
        float: 'right',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: 8
      },
      topic: {
        minWidth: '50%',
        borderBottom: '1px solid white',
        display: 'inline-block',
        fontSize: 18,
        paddingBottom: 6
      },
      controls: {
        color: 'white',
        height: 150,
        backgroundColor: '#444',
        width: '100%',
        padding: '10px 20px'
      },
      commentText: {
        width: '55%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      right: {
        width: '45%',
        display: 'inline-block',
        verticalAlign: 'top',
        paddingLeft: 25
      },
      textbox: {
        width: '100%',
        height: 100,
        borderRadius: 5,
        padding: 5,
        fontSize: 13
      },
      checkLabel: {
        fontSize: 11
      },
      comments: {
        overflowY: 'auto',
        flexDirection: 'column-reverse'
      },
      comment: {
        marginTop: 10,
        marginBottom: 10
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
            new={comment.new}
          />
        );
      });
    }

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.heading}>
          <span style={styles.close} onClick={this.done}>X CLOSE</span>
          <span style={styles.topic}>{this.props.topic}</span>
        </div>

        <div className="fill flexbox" style={styles.comments}>
          <div>
            {comments}
          </div>
        </div>

        <div style={styles.controls}>
          <span style={styles.commentText}>
            <div>COMMENT:</div>
            <div>
              <textarea style={styles.textbox} ref="commentText" />
            </div>
          </span>
          <span style={styles.right}>
            <div>RECIPIENT:</div>
            <div>
              <input type="checkbox" id="piCheck" ref="piCheck" />
              <label htmlFor="piCheck" style={styles.checkLabel}>PRINCIPAL INVESTIGATOR</label>
            </div>
            <div>
              <KButton style={{marginTop: 25}} onClick={this.makeComment}>Submit</KButton>
            </div>
          </span>
        </div>
      </div>
    );
  }
}
