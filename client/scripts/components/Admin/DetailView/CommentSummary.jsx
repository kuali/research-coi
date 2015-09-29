import React from 'react/addons';
import {merge} from '../../../merge';
import TopicCommentSummary from './TopicCommentSummary';
import {AdminActions} from '../../../actions/AdminActions';

export default class CommentSummary extends React.Component {
  done() {
    AdminActions.hideCommentSummary();
  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'black',
        height: '100%',
        color: 'white',
        padding: '10px 25px',
        overflowY: 'auto'
      },
      heading: {
        color: 'white',
        padding: '10px 20px',
        marginBottom: 20,
        zIndex: 99,
        position: 'relative',
        backgroundColor: 'black'
      },
      close: {
        float: 'right',
        fontWeight: 'bold',
        cursor: 'pointer'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.heading}>
          <span style={styles.close} onClick={this.done}>X CLOSE</span>
        </div>

        <TopicCommentSummary
          topicName={'QUESTION 1'}
          comments={[
            {
              id: 3,
              date: new Date(),
              author: 'Rehsu Evad',
              text: 'Hey man whats up?'
            },
            {
              id: 4,
              date: new Date(),
              author: 'Nikrud Yrret',
              text: 'Not much.  Just working on my COI disclosure. Are we supposed to use this for chatting? Seems like maybe we could text or something.'
            }
          ]}
        />

        <TopicCommentSummary
          topicName={'QUESTION 2'}
          comments={[
            {
              id: 30,
              date: new Date(),
              author: 'Rehsu Evad',
              text: 'You did this whole thing wrong.  Just start over.'
            },
            {
              id: 31,
              date: new Date(),
              author: 'Nikrud Yrret',
              text: 'I don\'t think thats necessary.  Just take a few breaths and remain calm.'
            }
          ]}
        />

        <TopicCommentSummary
          topicName={'FINANCIAL ENTITY: Xerox Corporation'}
          comments={[
            {
              id: 322,
              date: new Date(),
              author: 'Rehsu Evad',
              text: 'You did this whole thing wrong.  Just start over.'
            },
            {
              id: 3333,
              date: new Date(),
              author: 'Nikrud Yrret',
              text: 'I don\'t think thats necessary.  Just take a few breaths and remain calm.'
            }
          ]}
        />

        <TopicCommentSummary
          topicName={'FINANCIAL ENTITY: Dole Fruit Company'}
          comments={[
            {
              id: 34343,
              date: new Date(),
              author: 'Rehsu Evad',
              text: 'Do you have a spare pineapples from your research?  I really like to make smoothies with it.'
            },
            {
              id: 6543,
              date: new Date(),
              author: 'Nikrud Yrret',
              text: 'Wow... kinda weird to ask on COI, but yeah I have some.  Swing by tonight and I can give you a box.'
            }
          ]}
        />

      </div>
    );
  }
}
