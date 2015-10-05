import React from 'react/addons';
import {merge} from '../../../merge';

export default class DeclarationSection extends React.Component {
  render() {
    let styles = {
      container: {
        margin: '25px 20px 25px 35px',
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0 0 10px 2px #DDD'
      },
      title: {
        fontSize: 23,
        padding: '10px 18px',
        borderBottom: '1px solid #DDD'
      },
      body: {
        padding: '10px 18px'
      }
    };

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          DECLARATIONS
        </div>
        <div className="fill" style={styles.body}>

          
        </div>
      </div>
    );
  }
}
