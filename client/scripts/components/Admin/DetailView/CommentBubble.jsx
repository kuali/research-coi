import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';

export default class CommentBubble extends React.Component {
  render() {
    let styles = {
      container: {
        backgroundColor: this.props.isUser ? 'white' : window.colorBlindModeOn ? 'white' : '#D0E3E5',
        border: '1px solid #CCC',
        borderRadius: 10,
        boxShadow: '0 0 10px 0px #CCC',
        color: 'black',
        display: 'inline-block',
        marginLeft: this.props.isUser ? '35%' : '0',
        padding: '8px 25px 15px 25px',
        transform: this.props.new ? 'translateY(125%)' : 'translateY(0%)',
        transition: 'transform .2s ease-out',
        width: '60%'
      },
      date: {
        float: 'right',
        color: '#666',
        fontSize: 12,
        fontWeight: 300
      },
      author: {
        fontWeight: 'bold',
        fontSize: 14
      },
      text: {
        fontSize: 12,
        marginTop: 7
      }
    };

    let theDate;
    if (this.props.date) {
      theDate = formatDate(this.props.date);
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={{width: '100%'}}>
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
