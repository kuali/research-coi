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
        backgroundColor: 'white',
        height: '100%',
        boxShadow: '0 0 10px 0 #AAA'
      },
      heading: {
        color: 'black',
        padding: '18px 20px 10px 20px',
        marginBottom: 20,
        boxShadow: '22px 50px 100px white',
        zIndex: 99,
        position: 'relative',
        backgroundColor: 'white'
      },
      close: {
        float: 'right',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: 8,
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 20
      },
      topic: {
        minWidth: '50%',
        borderBottom: '1px solid black',
        display: 'inline-block',
        fontSize: 18,
        paddingBottom: 6
      },
      controls: {
        color: '#333',
        height: 150,
        backgroundColor: '#F2F2F2',
        width: '100%',
        padding: '10px 20px',
        borderTop: '1px solid #333'
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
        fontSize: 13,
        resize: 'none',
        border: '1px solid #AAA'
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
      },
      submitButton: {
        marginTop: 25,
        backgroundColor: '#00BCD4',
        color: 'white',
        fontSize: 17,
        borderBottom: '3px solid #797979'
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

    let commentForm;
    if (!this.props.readonly) {
      commentForm = (
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
                <KButton style={styles.submitButton} onClick={this.makeComment}>Submit</KButton>
              </div>
            </span>
        </div>
      );
    }

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.heading}>
          <span style={styles.close} onClick={this.done}>
            <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
          </span>
          <span style={styles.topic}>{this.props.topic}</span>
        </div>

        <div className="fill flexbox" style={styles.comments}>
          <div>
            {comments}
          </div>
        </div>

        {commentForm}
      </div>
    );
  }
}
