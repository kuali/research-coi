/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import React from 'react';
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
