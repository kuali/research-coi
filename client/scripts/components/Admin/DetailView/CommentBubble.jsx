import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';

export default class CommentBubble extends React.Component {
  render() {
    let styles = {
      container: {
        backgroundColor: this.props.isUser ? 'white' : window.colorBlindModeOn ? 'black' : '#D8E9EB',
        borderRadius: 10,
        width: '60%',
        display: 'inline-block',
        padding: '8px 15px 15px 15px',
        marginLeft: this.props.isUser ? '35%' : '5%',
        transform: this.props.new ? 'translateY(125%)' : 'translateY(0%)',
        transition: 'transform .2s ease-out',
        border: '1px solid #CCC',
        boxShadow: '0 0 10px 0px #CCC'
      },
      date: {
        float: 'right',
        color: '#666',
        fontSize: 14
      },
      author: {
        fontWeight: 'bold',
        fontSize: 14
      },
      text: {
        fontSize: 13,
        marginTop: 7
      }
    };

    let theDate;
    if (this.props.date) {
      theDate = formatDate(this.props.date);
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span>
          <div>
            <span style={styles.date}>{theDate}</span>
            <span style={styles.author}>{this.props.author}</span>
          </div>
          <div style={styles.text}>
            {this.props.text}
          </div>
        </span>
      </div>
    );
  }
}
