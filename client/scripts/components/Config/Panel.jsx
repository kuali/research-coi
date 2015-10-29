import React from 'react/addons';
import {merge} from '../../merge';

export default class Panel extends React.Component {
  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        boxShadow: '0 0 10px #BBB',
        marginBottom: 22,
        borderRadius: 5
      },
      title: {
        borderBottom: '1px solid #AAA',
        padding: '10px 17px',
        fontSize: 17,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '5px 5px 0 0',
        overflow: 'hidden'
      },
      content: {
        padding: 10,
        borderRadius: '0 0 5px 5px'
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          {this.props.title}
        </div>
        <div style={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
