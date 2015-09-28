import React from 'react/addons';
import {merge} from '../../../merge';
import CommentBubble from './CommentBubble';
import {AdminActions} from '../../../actions/AdminActions';
import {KButton} from '../../KButton';

export default class CommentPanel extends React.Component {
  done() {
    AdminActions.hideCommentPanel();
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
        cursor: 'pointer'
      },
      topic: {
        width: '40%',
        borderBottom: '1px solid white',
        display: 'inline-block',
        fontSize: 18,
        paddingBottom: 3
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

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.heading}>
          <span style={styles.close} onClick={this.done}>X CLOSE</span>
          <span style={styles.topic}>QUESTION 1</span>
        </div>

        <div className="fill flexbox" style={styles.comments}>
          <div>
            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Well, hello there!  Thanks for submitting this disclosure.  You tried real hard!'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Terry Durkin'}
              text={'Thanks! Just so you know... I don\'t like you.'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Please go away.'}
              style={styles.comment}
            />

            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Well, hello there!  Thanks for submitting this disclosure.  You tried real hard!'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Terry Durkin'}
              text={'Thanks! Just so you know... I don\'t like you.'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Please go away.'}
              style={styles.comment}
            />

            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Well, hello there!  Thanks for submitting this disclosure.  You tried real hard!'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Terry Durkin'}
              text={'Thanks! Just so you know... I don\'t like you.'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Please go away.'}
              style={styles.comment}
            />

            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Well, hello there!  Thanks for submitting this disclosure.  You tried real hard!'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Terry Durkin'}
              text={'Thanks! Just so you know... I don\'t like you.'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Please go away.'}
              style={styles.comment}
            />

            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Well, hello there!  Thanks for submitting this disclosure.  You tried real hard!'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Terry Durkin'}
              text={'Thanks! Just so you know... I don\'t like you.'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Please go away.'}
              style={styles.comment}
            />

            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Joel Dehlin'}
              text={'Stop fighting.  Its bad for morale.'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Chris Coppola'}
              text={'Stay out of this Joel!'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={false}
              date={new Date()}
              author={'Jennie Williams'}
              text={'Quiet!'}
              style={styles.comment}
            />
            <CommentBubble
              isUser={true}
              date={new Date()}
              author={'Gary Wilkerson'}
              text={'Sorry  :('}
              style={styles.comment}
            />
          </div>
        </div>

        <div style={styles.controls}>
          <span style={styles.commentText}>
            <div>COMMENT:</div>
            <div>
              <textarea style={styles.textbox} />
            </div>
          </span>
          <span style={styles.right}>
            <div>RECIPIENT:</div>
            <div>
              <input type="checkbox" id="piCheck" />
              <label htmlFor="piCheck" style={styles.checkLabel}>PRINCIPAL INVESTIGATOR</label>
            </div>
            <div>
              <input type="checkbox" id="addRevCheck" />
              <label htmlFor="addRevCheck" style={styles.checkLabel}>ADDITIONAL REVIEWER</label>
            </div>
            <div>
              <KButton style={{marginTop: 25}}>Submit</KButton>
            </div>
          </span>
        </div>
      </div>
    );
  }
}
